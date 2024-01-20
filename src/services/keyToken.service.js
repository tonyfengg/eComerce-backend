'use strict';

const { Types } = require('mongoose');
const keyTokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    try {
      // lv1
      // const publicKeyString = publicKey.toString(); // comment for node:crypto
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   // publicKey: publicKeyString, // comment for node:crypto
      //   publicKey, // for node:crypto
      //   privateKey, // for node:crypto
      // });
      // return tokens ? tokens.publicKey : null;

      // lvxx
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }
  static findByUserId = async ({ userId }) => {
    try {
      const tokens = await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
      // console.log(`tokens::`, tokens);
      return tokens;
    } catch (error) {
      return error;
    }
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };
  static removeKeyToken = async (id) => {
    return await keyTokenModel.deleteOne({ _id: new Types.ObjectId(id) });
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) });
  };
}

module.exports = KeyTokenService;
