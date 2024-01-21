'use strict';
const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandle');
const { HEADER } = require('../constants/common.constans');
const { AuthFailureError, NotfoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, publicKey, {
      // for node:crypto publicKey, RSA256 algorithm using privateKey
      // algorithm: 'RS256', // comment for node:crypto
      expiresIn: '2 days',
    });
    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256', // comment for node:crypto
      expiresIn: '7 days',
    });

    // verify token
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify::`, err);
      } else {
        console.log(`decode::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(`createTokenPair error::`, error);
    return error;
  }
};
// v1
const authentication = asyncHandler(async (req, res, next) => {
  /*
  1 - check user missing?
  2 - get accessToken
  3 - verify accessToken
  4 - check user exist in db?
  5 - check keyStore with userId?
  6 - Ok all => next()
  */
  // step1: check user missing?
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid request');
  // step2: get accessToken
  const keyStore = await findByUserId({ userId });
  if (!keyStore) throw new NotfoundError('Not found keyStore');

  // step3: verify accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid request');

  try {
    // console.log(`accessToken::`, keyStore.publicKey);
    const decoded = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decoded.userId) throw new AuthFailureError('Invalid User');
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log(`error::`, error);
    throw error;
  }
});

// v2
const authenticationV2 = asyncHandler(async (req, res, next) => {
  // step1: check user missing?
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid request');
  // step2: get accessToken
  const keyStore = await findByUserId({ userId });
  console.log(`keyStore::`, keyStore);
  if (!keyStore) throw new NotfoundError('Not found keyStore');

  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  if (refreshToken) {
    try {
      const decoded = JWT.verify(refreshToken, keyStore.privateKey);
      req.keyStore = keyStore;
      req.user = decoded;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  // step3: verify accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid request');
  try {
    // console.log(`accessToken::`, keyStore.publicKey);
    const decoded = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decoded.userId) throw new AuthFailureError('Invalid User');
    req.keyStore = keyStore;
    req.user = decoded;
    return next();
  } catch (error) {
    console.log(`error::`, error);
    throw error;
  }
});
const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT,
};
