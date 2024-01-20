'use strict';
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _CHECK_OVERLOAD_MS = 5000;
// count connections
const countConnect = () => {
  const numConnect = mongoose.connections.length;
  console.log('Number of connections::', numConnect);
};

// check overload connections
const checkOverload = () => {
  setInterval(() => {
    const numConnect = mongoose.connections.length;
    const numCors = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on the number of cores
    const maxConnections = numCors * 5;
    console.log('Active connections::', numConnect);
    console.log('Memory usage::', memoryUsage / 1024 / 1024, 'MB');

    if (numConnect > maxConnections) {
      console.log('Connect overload detected::', numConnect);
      // notify to team
    }
  }, _CHECK_OVERLOAD_MS); // monitor every 5s
};

module.exports = { countConnect, checkOverload };
