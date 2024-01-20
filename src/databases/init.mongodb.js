'use strict';
const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');
const {
  db: { host, port, name },
} = require('../configs/config.mongodb');

const connectString = `mongodb://${host}:${port}/${name}`;
console.log('connectString::', connectString);
class Database {
  constructor() {
    this._connect();
  }
  _connect(type = 'mongodb') {
    // debug is dev
    if (true) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    // mongodb connection
    mongoose
      .connect(connectString)
      .then(() => console.log('MongoDB connected'), countConnect())
      .catch((err) => console.log('MongoDB connection error', err));
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
