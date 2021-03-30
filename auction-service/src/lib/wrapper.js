import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';

const wrapper = (lambda) => {
  return middy(lambda).use(httpJsonBodyParser()).use(httpEventNormalizer()).use(httpErrorHandler());
};

export default wrapper;

/*
 * @httpEventNormalizer
 * This middleware normalizes the API Gateway event , making sure
 * that an object for queryStringParameters, multiValueQueryStringParameters
 * and pathParameters is always available (resulting in empty objects when
 * no parameter is available), this way you don't have to worry about adding
 * extra if statements before trying to read a property
 *
 * @httpErrorHandler
 * Automatically handles uncaught errors that contain the properties
 * statusCode (number) and message (string) and creates a proper HTTP
 * response for them
 */
