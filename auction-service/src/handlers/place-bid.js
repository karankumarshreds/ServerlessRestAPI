import AWS from 'aws-sdk';
import wrapper from '../lib/wrapper';
import createError from 'http-errors';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event, context) => {
  const { amount } = event.body;
  const { id } = event.pathParameters;
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

export const handler = wrapper(placeBid);