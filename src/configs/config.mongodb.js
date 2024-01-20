'use strict';

// level one
// const config = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     host: '127.0.0.1',
//     port: 27017,
//     name: 'shopDEV',
//   },
// };

// level two -> three
const dev = {
  app: {
    port: process.env.DEV_PORT || 3033,
  },
  db: {
    host: process.env.DEV_DB_HOST || '127.0.0.1',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDEV',
  },
};

const pro = {
  app: {
    port: process.env.PRO_PORT || 3033,
  },
  db: {
    host: process.env.PRO_DB_HOST || '127.0.0.1',
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || 'shopPRO',
  },
};
const config = {
  dev,
  pro,
};
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];
