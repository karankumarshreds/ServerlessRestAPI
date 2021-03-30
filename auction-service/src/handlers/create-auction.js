import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event, context) => {
  const { title, price } = JSON.parse(event.body);
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    price,
    createdAt: now.toISOString(),
  };

  await dynamoDb
    .put({
      TableName: 'AuctionsTable',
      Item: auction,
    })
    .promise(); // because bydefault it uses cb (then)

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = createAuction;

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
 */
