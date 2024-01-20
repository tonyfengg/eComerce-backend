'use strict';

const keyTokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey }) {
    try {
      // const publicKeyString = publicKey.toString(); // comment for node:crypto
      const tokens = await keyTokenModel.create({
        user: userId,
        // publicKey: publicKeyString, // comment for node:crypto
        publicKey, // for node:crypto
        privateKey, // for node:crypto
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }
}

module.exports = KeyTokenService;
