const app = require("./src/app");
const PORT = process.env.PORT || 3033;

const server = app.listen(PORT, () => {
  console.log("Server running on port::", PORT);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received.");
  server.close(() => {
    console.log("Http server closed.");
    process.exit(0);
  });
  // app.notify("SIGINT signal received.");
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  //   server.close(() => process.exit(1));
});
