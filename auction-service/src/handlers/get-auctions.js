import AWS from 'aws-sdk';
import createError from 'http-errors';
import wrapper from '../lib/wrapper';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event, context) => {
  let auctions;
  try {
    // documents are returned as Items
    const { Items } = await dynamoDb.scan({ TableName: process.env.AUCTIONS_TABLE_NAME }).promise();
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
