'use strict';

const AccessService = require('../services/access.service');
const { SuccessResponse, CREATED } = require('../core/success.response');

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Token Success!',
      // metadata: await AccessService.handleRefreshToken(req.body.refreshToken), v1
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }), // v2
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({ message: 'Registered Success!', metadata: await AccessService.signUp(req.body) }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({ metadata: await AccessService.login(req.body) }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout Success!',
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };
}

module.exports = new AccessController();
