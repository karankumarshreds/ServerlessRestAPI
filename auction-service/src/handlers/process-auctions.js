// import AWS from 'aws-sdk';
import wrapper from '../lib/wrapper';
import { getEndedAuctions } from '../lib/get-ended-auction';
import { closeAuction } from '../lib/close-auction';
import createError from 'http-errors';

const processAuctions = async (event, context) => {
  try {
    const auctions = await getEndedAuctions();
    // returns array of promises bcs we are not using await
    const closePromises = auctions.map((auction) => closeAuction(auction.id));
    // runs parallely
    await Promise.all(closePromises);
    // returning early like this bcs this function is not
    // invoked by an HTTP call
    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
};

export const handler = wrapper(processAuctions);
