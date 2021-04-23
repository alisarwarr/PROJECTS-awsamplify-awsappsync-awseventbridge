import * as cdk from '@aws-cdk/core';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
//APPSYNC
import * as appsync from '@aws-cdk/aws-appsync';
//EVENTBRIDGE
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
//VTL-REQUEST-RESPONSE
import { requestTemplate, responseTemplate } from '../utils/appsync-request-response';

export class AppsyncEventbridgeBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //APPSYNC's API gives you a graphqlApi with apiKey ( for deploying APPSYNC )
    const api = new appsync.GraphqlApi(this, 'graphlApi', {
      name: 'serverlesstodoapp-api',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    });


    //creating HTTPdatasource ( that will put our event to the eventbus )
    const http_datasource = api.addHttpDataSource('serverlesstodoapp-ds',
      //ENDPOINT for eventbridge
      `https://events.${this.region}.amazonaws.com/`,
      {
        name: 'httpDsWithEventBridge',
        description: 'From Appsync to Eventbridge',
        authorizationConfig: {
          signingRegion: this.region,
          signingServiceName: 'events'
        }
      }
    );
    //giving permissions for HTTPdatasource
    events.EventBus.grantPutEvents(http_datasource);


    //mutations
    const mutations = ["createTodo", "deleteTodo", "updateTodo"];
    mutations.forEach((thatMutation) => {
      let details = `\\\"id\\\": \\\"$ctx.args.id\\\"`;

      if(thatMutation === "createTodo" || thatMutation === "updateTodo") {
        details = `\\\"id\\\":\\\"$ctx.args.id\\\", \\\"detail\\\":\\\"$ctx.args.detail\\\"`;
      }
      
      //describing resolver for db_datasource ( for send data to dynamoDB )
      http_datasource.createResolver({
        typeName: "Mutation",
        fieldName: thatMutation,
        requestMappingTemplate: appsync.MappingTemplate.fromString(requestTemplate(details, thatMutation)),
        responseMappingTemplate: appsync.MappingTemplate.fromString(responseTemplate()),
      });
    });


    //creating lambdafunctions
    const dynamodbLambda = new lambda.Function(this, 'serverlesstodoapp-dynamodbLambda', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler'
    });
    

//**************************DYNAMODB**************************/
    //creating table
    const myTable = new ddb.Table(this, 'serverlesstodoapp-table', {
      partitionKey: {                          //like unique primarykey for record indentification
        name: 'id',
        type: ddb.AttributeType.STRING
      }
    });
    //for give access to lambdafunction ( to get data from dynamoDB's table )
    myTable.grantReadWriteData(dynamodbLambda);
    //for tell lambdafunction ( that this named table consider for storing )
    dynamodbLambda.addEnvironment('TABLE_NAME', myTable.tableName);    
//**************************DYNAMODB**************************/


    //setting table as a datasource of endpoint
    const db_datasource = api.addDynamoDbDataSource('DBDataSource', myTable);
    //describing resolver for db_datasource ( for get data from dynamoDB )
    db_datasource.createResolver({
      typeName: "Query",
      fieldName: "allTodos",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    });
    

    //rule fire by default event bus has target 'dynamodbLambda'
    const rule = new events.Rule(this, 'appsyncEventbridgeRule', {
      ruleName: 'serverlesstodoapp-appsyncEventbridgeRule',
      description: 'created for appSyncEventbridge',
      eventPattern: {
        source: ["serverlesstodoapp-events"],
        //every event that has source = "serverlesstodoapp-events" will be sent to 'dynamodbLambda'
      },
      targets: [new targets.LambdaFunction(dynamodbLambda)]
    });
  }
}
