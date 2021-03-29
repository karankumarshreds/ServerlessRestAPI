const createAuction = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ event, context }),
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
