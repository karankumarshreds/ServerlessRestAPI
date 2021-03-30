import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import wrapper from '../lib/wrapper';

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

export const handler = wrapper(createAuction);

/**
 * @event
 * This will contain all the information about the event
 * that is triggering the execution of this function
 * In our case it is a POST call at '/auction' defined in
 * the serverless.yml file
 *
 * @context
 * Contains metadata about the execution of this lambda function
 * This is also where you can add your middlewares as well
 */
