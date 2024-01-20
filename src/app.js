require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
// const bodyParser = require('body-parser');
// const { checkOverload } = require('./helpers/check.connect');
const { isDev } = require('./configs/config.app');
const app = express();

// init middleware
app.use(morgan('dev')); // dev combined common short tiny
app.use(helmet());
app.use(compression());
// app.use(bodyParser.json({ limit: '1000mb' }));
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));

// init db
require('./databases/init.mongodb');
// checkOverload();

// init routes
app.use('/', require('./routes/index'));

// handle errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    message: error.message || 'internal server error',
    status: 'error',
    stack: isDev ? error.stack : undefined,
    code: statusCode,
  });
});

module.exports = app;
