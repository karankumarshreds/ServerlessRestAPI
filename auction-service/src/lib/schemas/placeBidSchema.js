const schema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
        },
      },
      required: ['amount'],
    },
    pathParameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
      required: ['id'],
    },
  },
  required: ['body', 'pathParameters'],
};

export default schema;
