'use strict';
const { getSelectData, unGetSelectData } = require('../../utils');
const { product, clothing, electronics, furniture } = require('../product.model');
const { Types } = require('mongoose');
const findAllDraftForShop = async ({ query, limit, skip }) => queryProduct({ query, limit, skip });
const findAllPublishForShop = async ({ query, limit, skip }) => queryProduct({ query, limit, skip });
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } },
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean()
    .exec();
  return result;
};

const publishProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};
const unPublishProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};
const findAllProduct = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
  return products;
};
const queryProduct = async ({ query, limit, skip }) =>
  await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
const findProduct = async ({ product_id, unSelect }) => {
  return product.findById(product_id).select(unGetSelectData(unSelect)).lean().exec();
};
const updateProductById = async ({ productId, payload, model, isNew = true }) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew }).lean();
};

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProduct,
  findProduct,
  updateProductById,
};
