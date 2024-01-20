'use strict';

const apiKeyModel = require('../models/apiKey.model');

const findById = async (key) => {
  // const crypto = require('crypto');

  // const newKey = await apiKeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permissions: ['0000'] });
  // console.log('newKey::', newKey);
  const objKey = await apiKeyModel.findOne({ key, status: true }).collation({ locale: 'en' }).lean();
  return objKey;
};
// findById();
module.exports = { findById };
