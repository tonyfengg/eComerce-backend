'use strict';
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { RoleShop } = require('../constants/common.constans');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, ConflictRequest, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

class AccessService {
  // check token used
  static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something went wrong!! Pls login again');
    }
    if (keyStore.refreshToken !== refreshToken) new AuthFailureError('Shop not found!');

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop not found!');
    // create new token pair
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

    // update keyToken
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken, // new refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // is used get new token
      },
    });

    return {
      user,
      tokens,
    };
  };
  static handleRefreshToken = async (refreshToken) => {
    // check token used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      //decode token
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
      console.log(`userId::`, userId, email);
      // delete all keyToken
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something went wrong!! Pls login again');
    }

    // not found token used
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError('Shop not found!');
    // verify token
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
    //check user exist in db?
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop not found!');

    // create new token pair
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);

    // update keyToken
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken, // new refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // is used get new token
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step1: check email exist
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error Shop already registered!');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // create private key, public key
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // });
      const privateKey = crypto.randomBytes(64).toString('hex'); // for node:crypto
      const publicKey = crypto.randomBytes(64).toString('hex'); // for node:crypto

      console.log({ privateKey, publicKey }); // save collection key store
      // const publicKeyString = await KeyTokenService.createKeyToken({ // comment for node:crypto
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey, // for node:crypto
      });
      // if (!publicKeyString) { // comment for node:crypto
      if (!keyStore) {
        throw new BadRequestError('keyStore error');
      }
      // const publicKeyObject = crypto.createPublicKey(publicKeyString); // comment for node:crypto
      // console.log(`publicKeyObject::`, publicKeyObject);
      // create token pair
      // const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey); // comment for node:crypto
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
      console.log(`Create token pair::`, tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
  /*
    1 - check email exist
    2 - check password match
    3 - create access token and refresh token save
    4 - generate token
    5 - get data return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    // step1: check email exist
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Shop not found!');
    // step2: check password match
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError('Authentication error');
    // step3: create access token and refresh token save
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');
    // step4: generate token
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    // step5: get data return login
    return { shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }), tokens };
  };

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyToken(keyStore._id);
    return delKey;
  };
}

module.exports = AccessService;
