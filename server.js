const app = require('./src/app');
const {
  app: { port },
} = require('./src/configs/config.mongodb');

const server = app.listen(port, () => {
  console.log('Server running on port::', port);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received.');
  server.close(() => {
    console.log('Http server closed.');
    process.exit(0);
  });
  // app.notify("SIGINT signal received.");
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err}`);
  //   server.close(() => process.exit(1));
});
