'use strict';

const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
// [ 'product_name', 'product_price', 'product_description' ] => { product_name: 1, product_price: 1, product_description: 1 }
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};
// [ 'product_name', 'product_price', 'product_description' ] => { product_name: 0, product_price: 0, product_description: 0 }
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};
// remove undefined or null object
const removeUndefinedObject = (object) => {
  Object.keys(object || {}).forEach((key) => {
    if (object[key] === undefined || object[key] === null) {
      delete object[key];
    }
  });
  return object;
};
// update nested object
const updateNestedObjectParse = (obj) => {
  const done = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    } else if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParse(obj[key]);
      Object.keys(response).forEach((childKey) => {
        done[`${key}.${childKey}`] = response[childKey];
      });
    } else {
      done[key] = obj[key];
    }
  });
  return done;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParse,
};
