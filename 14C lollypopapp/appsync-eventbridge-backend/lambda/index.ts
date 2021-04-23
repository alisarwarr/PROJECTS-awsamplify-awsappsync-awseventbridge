const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {
    if(event["detail-type"] === "addLollypop") {
        const params = {
            TableName: process.env.TABLE_NAME || '',
            Item: {
                ...event.detail
            }
        }

        try {
            await docClient.put(params).promise();                      //add specific data into database
        }
        catch (err) {
            console.log(err);
        }
    }
}
