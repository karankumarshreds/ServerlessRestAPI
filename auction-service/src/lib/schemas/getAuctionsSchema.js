// schema for body/request validation
const schema = {
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          // 'opened' || 'closed'
          type: 'string',
          enum: ['OPEN', 'CLOSED'],
          default: 'OPEN',
        },
      },
    },
  },
  // mentioning the list of properties required
  required: ['queryStringParameters'],
};

export default schema;

/**
 * uses @middy/validator package
 * NOTE: use package version @middy/validator@1.2.0
 */
