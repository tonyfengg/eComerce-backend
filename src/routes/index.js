'use strict';
const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const accessRouter = require('./access');
const productRouter = require('./product');
const router = express.Router();

// check apiKey
router.use(apiKey);
// check permission
router.use(permission('0000'));

router.use('/v1/api/auth', accessRouter);
router.use('/v1/api/product', productRouter);

module.exports = router;
