require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
// const { checkOverload } = require('./helpers/check.connect');
const app = express();

// init middleware
app.use(morgan('dev')); // dev combined common short tiny
app.use(helmet());
app.use(compression());
// app.use(bodyParser.json({ limit: '1000mb' }));
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));

// init db
require('./dbs/init.mongodb');
// checkOverload();

// init routes
app.use('/', require('./routes/index'));

// handle errors

module.exports = app;
