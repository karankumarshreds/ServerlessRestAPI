import jwt from 'jsonwebtoken';

// By default, API Gateway authorizations are cached (TTL) for 300 seconds.
// This policy will authorize all requests to the same API Gateway instance where the
// request is coming from, thus being efficient and optimising costs.
const generatePolicy = (principalId, methodArn) => {
  const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';

  /**
   * This is an allow policy that allows all the requests coming
   * to the api gateway
   * We are generating this policy ONLY IF the authorization is
   * valid, if not, then the request does not get authorized
   * or allowed
   */
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
};

export async function handler(event, context) {
  if (!event.authorizationToken) {
    throw 'Unauthorized';
  }

  // takes in the authorizationToken from the request header
  // and verifies the signature
  const token = event.authorizationToken.replace('Bearer ', '');

  try {
    const claims = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY);
    const policy = generatePolicy(claims.sub, event.methodArn);

    return {
      ...policy, // attaching policies (authorized flag and token)
      context: claims, // we can attach any extra information about the
      // validated user which might be needed by other functions
    };
  } catch (error) {
    console.log(error);
    throw 'Unauthorized';
  }
}
