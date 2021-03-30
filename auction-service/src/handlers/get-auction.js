import AWS from 'aws-sdk';
import createError from 'http-errors';
import wrapper from '../lib/wrapper';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getAuction = async (event, context) => {
  const { id } = event.pathParameters;
  let auction;

  try {
    const { Item } = await dynamoDb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();
    auction = Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError('Internal Server Error');
  }

  if (!auction) {
    throw new createError.NotFound('Auction not found');
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

export const handler = wrapper(getAuction);
