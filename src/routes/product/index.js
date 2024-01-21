'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandle');
const { authenticationV2 } = require('../../auth/authUtils');

// search
router.get('/search', asyncHandler(productController.getListSearchProduct));
router.get('', asyncHandler(productController.findAllProducts));
router.get('/:product_id', asyncHandler(productController.findProduct));

// authentication
router.use(authenticationV2);
// POST //
router.post('/create', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProduct));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProduct));

// QUERY //
router.get('/draft/all', asyncHandler(productController.getAllDraftForShop));
router.get('/published/all', asyncHandler(productController.getAlPublishForShop));

module.exports = router;
