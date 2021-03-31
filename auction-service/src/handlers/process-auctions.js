import AWS from 'aws-sdk';
import wrapper from '../lib/wrapper';
import createError from 'http-errors';
import { getAuctionById } from '../handlers/get-auction';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const processAuctions = async (event, context) => {
  const id = event.pathParameters;
  const auction = getAuctionById(id);
  try {
    // documentdb query
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 201,
    body: 'All auctions processed',
  };
};

export const handler = wrapper(processAuctions);
