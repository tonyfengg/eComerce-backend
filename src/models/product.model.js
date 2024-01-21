'use strict';

const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture', 'Grocery', 'Others'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

// define the Product type = clothing, electronics, furniture, grocery, others

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  },
  {
    timestamps: true,
    collection: 'clothes',
  },
);

const electronicsSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  },
  {
    timestamps: true,
    collection: 'electronics',
  },
);

const furnitureSchema = new Schema(
  {
    material: { type: String, required: true },
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  },
  {
    timestamps: true,
    collection: 'furniture',
  },
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronics: model('Electronics', electronicsSchema),
  furniture: model('Furniture', furnitureSchema),
};
