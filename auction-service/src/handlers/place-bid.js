import AWS from 'aws-sdk';
import wrapper from '../lib/wrapper';
import createError from 'http-errors';
import validator from '@middy/validator';
import placeBidSchema from '../lib/schemas/placeBidSchema';
// methods
import { getAuctionById } from './get-auction';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event, context) => {
  const { amount } = event.body;
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden('Cannot bid less than highest bid');
  }
  if (auction.status !== 'OPEN') {
    throw new createError.Forbidden('Cannot bid on closed auction');
  }

  let updatedItem;
  try {
    const result = await dynamoDb
      .update({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: `set highestBid.amount = :amount`,
        ExpressionAttributeValues: {
          ':amount': amount,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
    updatedItem = result.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  if (!updatedItem) {
    throw new createError.NotFound('Auction with ID not found');
  }
  return {
    statusCode: 201,
    body: JSON.stringify(updatedItem),
  };
};

export const handler = wrapper(placeBid).use(
  validator({ inputSchema: placeBidSchema, useDefaults: false })
);
