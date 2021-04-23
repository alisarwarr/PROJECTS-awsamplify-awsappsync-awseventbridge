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
      name: 'lollypopapp-api',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    });


    //creating HTTPdatasource ( that will put our event to the eventbus )
    const http_datasource = api.addHttpDataSource('lollypopapp-ds',
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
    const thatMutation = "addLollypop";
    const details = `\\\"id\\\":\\\"$ctx.args.id\\\", \\\"topColor\\\":\\\"$ctx.args.topColor\\\", \\\"middleColor\\\":\\\"$ctx.args.middleColor\\\", \\\"bottomColor\\\":\\\"$ctx.args.bottomColor\\\", \\\"to\\\":\\\"$ctx.args.to\\\", \\\"message\\\":\\\"$ctx.args.message\\\", \\\"from\\\":\\\"$ctx.args.from\\\"`;
    //describing resolver for db_datasource ( for send data to dynamoDB )
    http_datasource.createResolver({
      typeName: "Mutation",
      fieldName: thatMutation,
      requestMappingTemplate: appsync.MappingTemplate.fromString(requestTemplate(details, thatMutation)),
      responseMappingTemplate: appsync.MappingTemplate.fromString(responseTemplate()),
    });


    //creating lambdafunctions
    const dynamodbLambda = new lambda.Function(this, 'lollypopapp-dynamodbLambda', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler'
    });
    

//**************************DYNAMODB**************************/
    //creating table
    const myTable = new ddb.Table(this, 'lollypopapp-table', {
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
      fieldName: "allLollypop",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    });
    db_datasource.createResolver({
      typeName: "Query",
      fieldName: "getLollypopById",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem('id', 'id'),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    });
    

    //rule fire by default event bus has target 'dynamodbLambda'
    const rule = new events.Rule(this, 'appsyncEventbridgeRule', {
      ruleName: 'lollypopapp-appsyncEventbridgeRule-appsyncEventbridgeRule',
      description: 'created for appSyncEventbridge',
      eventPattern: {
        source: ["lollypopapp-events"],
        //every event that has source = "lollypopapp-events" will be sent to 'dynamodbLambda'
      },
      targets: [new targets.LambdaFunction(dynamodbLambda)]
    });
  }
}
