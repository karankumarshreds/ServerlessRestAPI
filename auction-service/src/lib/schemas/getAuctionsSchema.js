// schema for body/request validation
export default schema = {
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

/**
 * uses @middy/validator package
 */
