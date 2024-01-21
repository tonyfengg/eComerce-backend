'use strict';

const { HEADER } = require('../constants/common.constans');
const { findById } = require('../services/apiKey.service');

const apiKey = async (req, res, next) => {
  const openRoutes = ['/v1/api/product/search'];
  if (openRoutes.includes(req.path)) {
    console.log('openRoutes::', openRoutes, req.path);
    // return next();
  }
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: 'Forbidden Error' });
    }
    // check objKey
    const objKey = await findById(key);
    console.log('objKey::', objKey);
    if (!objKey) {
      return res.status(403).json({ message: 'Forbidden Error' });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: 'Forbidden Error' });
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    console.log('permission::', req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    console.log('validPermission::', validPermission);
    return next();
  };
};

module.exports = { apiKey, permission };
