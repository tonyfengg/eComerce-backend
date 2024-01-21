'use strict';

const { Schema, model } = require('mongoose');
const slugify = require('slugify');
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
    product_slug: String,
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
    // more
    product_ratings: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must can not be more than 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.66666, 47, 4.7
    },
    product_reviews: {
      type: Number,
      default: 0,
    },
    product_variants: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);
// create index for product_name, product_description
productSchema.index({ product_name: 'text', product_description: 'text' });

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

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
    brand: { type: String, required: true },
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
