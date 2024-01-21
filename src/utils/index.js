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
module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
};
