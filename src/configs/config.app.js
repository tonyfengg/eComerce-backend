const dev = {
  isDev: true,
};
const config = {
  dev,
  //   pro,
};
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];
