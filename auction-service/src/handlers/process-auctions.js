// import AWS from 'aws-sdk';
import wrapper from '../lib/wrapper';
import { getEndedAuctions } from '../lib/get-ended-auction';
// import createError from 'http-errors';
// import { getAuctionById } from '../handlers/get-auction';

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

const processAuctions = async (event, context) => {
  const auctions = await getEndedAuctions();
  console.log(auctions);
};

export const handler = wrapper(processAuctions);
