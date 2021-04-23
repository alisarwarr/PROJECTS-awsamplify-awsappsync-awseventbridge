const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {
    if(event["detail-type"] === "addBookmark") {
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

    else if(event["detail-type"] === "delBookmark") {
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
}
