import AWS from 'aws-sdk';
import createHttpError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const closeAuction = async (id) => {
  let updatedAuction;
  try {
    const { Item } = await dynamodb
      .update({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
          ':status': 'CLOSED',
        },
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
    updatedAuction = Item;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }
  return updatedAuction;
};
