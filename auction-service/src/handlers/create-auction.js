import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import wrapper from '../lib/wrapper';
import validator from '@middy/validator';
import createAuctionSchema from '../lib/schemas/createAuctionSchema';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event, context) => {
  const { title, price } = event.body;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  // authorizer === name of the authorizer function
  const { email } = event.requestContext.authorizer;

  const auction = {
    id: uuid(),
    title,
    price,
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    status: 'OPEN',
    seller: email,
    highestBid: {
      amount: 0,
      bidder: null,
    },
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

export const handler = wrapper(createAuction).use(
  validator({ inputSchema: createAuctionSchema, useDefaults: false })
);

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
