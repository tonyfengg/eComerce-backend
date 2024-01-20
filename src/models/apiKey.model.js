'use strict';
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'ApiKey'; // Declare the Schema of the Mongo model
const COLLECTION_NAME = 'ApiKeys';

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111'],
    },
  },
  {
    timestamps: true,
    collation: COLLECTION_NAME,
  },
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);
