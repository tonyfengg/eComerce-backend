'use strict';

const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronics, furniture } = require('../models/product.model');

// define Factory class to create product
class ProductFactory {
  static createProduct(type, payload) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).createProduct();
      case 'Electronics':
        return new Electronics(payload).createProduct();
      case 'Furniture':
        return new Furniture(payload).createProduct();
      default:
        throw new BadRequestError('Invalid product type!');
    }
  }
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
module.exports = ProductFactory;
