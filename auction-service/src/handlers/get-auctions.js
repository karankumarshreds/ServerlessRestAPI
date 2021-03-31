import AWS from 'aws-sdk';
import createError from 'http-errors';
import wrapper from '../lib/wrapper';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event, context) => {
  const { status } = event.queryStringParameters;
  let auctions;
  try {
    // documents are returned as Items
    // const { Items } = await dynamoDb.scan({ TableName: process.env.AUCTIONS_TABLE_NAME }).promise();
    const { Items } = await dynamoDb
      .query({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
        },
      })
      .promise();
    auctions = Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

export const handler = wrapper(getAuctions);
