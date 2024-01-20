'use strict';
const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};
const ReasonStatusCode = {
  FORBIDDEN: 'Bad request error',
  CONFLICT: 'Conflict error',
};
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequest extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}
class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode);
  }
}
class NotfoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode);
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode);
  }
}

module.exports = {
  AuthFailureError,
  ConflictRequest,
  BadRequestError,
  NotfoundError,
  ForbiddenError,
};
