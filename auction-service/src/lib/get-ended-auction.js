import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getEndedAuctions = async () => {
  const now = new Date();

  const { Items } = await dynamoDb
    .query({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      IndexName: 'statusAndEndDate',
      KeyConditionExpression: '#status = :status AND endingAt <= :now',
      ExpressionAttributeValues: {
        ':status': 'OPEN',
        ':now': now.toISOString(),
      },
      // adding this because status is dynamodb keyword as well
      // so adding a map to workaroung with this key name
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    })
    .promise();
  return Items;
};
