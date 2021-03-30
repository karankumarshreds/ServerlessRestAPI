import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import createError from 'http-errors';

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

export const handler = middy(getAuctions)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());