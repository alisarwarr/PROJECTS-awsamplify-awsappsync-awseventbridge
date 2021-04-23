const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {
    if(event["detail-type"] === "createTodo") {
        const params = {
            TableName: process.env.TABLE_NAME || '',
            Item: {
                ...event.detail
            }
        }

        try {
            await docClient.put(params).promise();           //add specific data into database
        }
        catch (err) {
            console.log(err);
        }
    }

    else if(event["detail-type"] === "deleteTodo") {
        const params = {
            TableName: process.env.TABLE_NAME || '',
            Key: {                                           //pass Key's id to hold specific data
                id: event.detail.id
            }
        }

        try {
            await docClient.delete(params).promise();        //delete that specific id's data 
        }
        catch (err) {
            console.log(err);
        }
    }

    else if(event["detail-type"] === "updateTodo") {
        let params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                id: event.detail.id
            },
            ExpressionAttributeValues: {},
            ExpressionAttributeNames: {},
            UpdateExpression: "",
            ReturnValues: "UPDATED_NEW"
        };
        let prefix = "set ";
        let attributes = Object.keys(event.detail);
        for (let i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];
            if (attribute !== "id") {
                params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
                params["ExpressionAttributeValues"][":" + attribute] = event.detail[attribute];
                params["ExpressionAttributeNames"]["#" + attribute] = attribute;
                prefix = ", ";
            }
        }
    
        
        try {
            await docClient.update(params).promise();        //updates specific data into database
        }
        catch (err) {
            console.log(err);
        }
    }
}
