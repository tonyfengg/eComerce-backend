'use strict';

const { SuccessResponse } = require('../core/success.response');
// const ProductServices = require('../services/product.service');
const ProductServicesV2 = require('../services/product.service.v2');

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create Product Success!',
      metadata: await ProductServicesV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  publishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish Product Success!',
      metadata: await ProductServicesV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  unPublishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'UnPublish Product Success!',
      metadata: await ProductServicesV2.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // QUERY //
  /**
   * @description: get all draft product for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get All Draft Product Success!',
      metadata: await ProductServicesV2.findAllDraftForShop({
        product_shop: req.user.userId,
        //   limit: parseInt(req.query.limit),
        //   skip: parseInt(req.query.skip),
      }),
    }).send(res);
  };
  getAlPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get All Publish Product Success!',
      metadata: await ProductServicesV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List Search Publish Product Success!',
      metadata: await ProductServicesV2.searchProduct({
        keySearch: req.query.search,
      }),
    }).send(res);
  };
  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get All Product Success!',
      metadata: await ProductServicesV2.findAllProducts(req.query),
    }).send(res);
  };
  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get All Product Success!',
      metadata: await ProductServicesV2.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // END QUERY //
}

module.exports = new ProductController();
