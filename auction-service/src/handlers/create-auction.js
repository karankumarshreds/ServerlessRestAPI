import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
// middlewares
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event, context) => {
  const { title, price } = event.body;
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    price,
    createdAt: now.toISOString(),
  };

  try {
    await dynamoDb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise(); // because bydefault it uses cb (then)
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = middy(createAuction)
  .use(httpJsonBodyParser()) // parses incoming json body
  .use(httpEventNormalizer())
  .use(httpErrorHandler());

/**
 * @event
 * This will contain all the information about the event
 * that is triggering the execution of this function
 * In our case it is a POST call at '/auction' defined in
 * the serverless.yml file
 *
 * @constant
 * Contains metadata about the execution of this lambda function
 * This is also where you can add your middlewares as well
 *
 * @httpEventNormalizer
 * This middleware normalizes the API Gateway event , making sure
 * that an object for queryStringParameters, multiValueQueryStringParameters
 * and pathParameters is always available (resulting in empty objects when
 * no parameter is available), this way you don't have to worry about adding
 * extra if statements before trying to read a property
 *
 * @httpErrorHandler
 * Automatically handles uncaught errors that contain the properties
 * statusCode (number) and message (string) and creates a proper HTTP
 * response for them
 */
