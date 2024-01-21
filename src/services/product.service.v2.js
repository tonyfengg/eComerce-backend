'use strict';

const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronics, furniture } = require('../models/product.model');
const {
  findAllDraftForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishForShop,
  searchProductByUser,
  findAllProduct,
  findProduct,
  updateProductById,
} = require('../models/repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParse } = require('../utils');

// define Factory class to create product
class ProductFactory {
  static productRegister = {}; // key-class
  static registerProduct(type, classRef) {
    ProductFactory.productRegister[type] = classRef;
  }
  static async createProduct(type, payload) {
    const ProductClass = ProductFactory.productRegister[type];
    if (!ProductClass) throw new BadRequestError('Invalid product types', type);
    return new ProductClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const ProductClass = ProductFactory.productRegister[type];
    if (!ProductClass) throw new BadRequestError('Invalid product types', type);
    return new ProductClass(payload).updateProduct(productId);
  }
  // PUT //
  static async publishProductByShop({ product_id, product_shop }) {
    return await publishProductByShop({ product_id, product_shop });
  }
  static async unPublishProductByShop({ product_id, product_shop }) {
    return await unPublishProductByShop({ product_id, product_shop });
  }
  // END PUT //
  // QUERY //
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }
  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_thumb'],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] });
  }
  // END QUERY //
}

// define base product class

class Product {
  constructor(payload) {
    this.product_name = payload.product_name;
    this.product_thumb = payload.product_thumb;
    this.product_description = payload.product_description;
    this.product_price = payload.product_price;
    this.product_quantity = payload.product_quantity;
    this.product_type = payload.product_type;
    this.product_shop = payload.product_shop;
    this.product_attributes = payload.product_attributes;
  }
  // create new product
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

// define sub-class for different product type clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('Create Clothing failed!');
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Create Product failed!');
    return newProduct;
  }
  async updateProduct(productId) {
    // 1 remove attribute has null and undefined

    const objectParams = this;
    // 2 check update product where ...
    if (objectParams.product_attributes) {
      // update child product
      const updateClothing = await updateProductById({
        productId,
        payload: objectParams.product_attributes,
        model: clothing,
      });
      return updateClothing;
    }

    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

// define sub-class for different product type electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronics) throw new BadRequestError('Create Electronics failed!');
    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestError('Create Product failed!');
    return newProduct;
  }
  async updateProduct(productId) {
    // 1 remove attribute has null and undefined
    const objectParams = removeUndefinedObject(this);
    // 2 check update product where ...
    if (objectParams.product_attributes) {
      // update child product
      await updateProductById({
        productId,
        payload: updateNestedObjectParse(objectParams.product_attributes),
        model: electronics,
      });
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams));
    return updateProduct;
  }
}

// define sub-class for different product type furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('Create Furniture failed!');
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('Create Product failed!');
    return newProduct;
  }
}

// register product type

ProductFactory.registerProduct('Clothing', Clothing);
ProductFactory.registerProduct('Electronics', Electronics);
ProductFactory.registerProduct('Furniture', Furniture);

module.exports = ProductFactory;
