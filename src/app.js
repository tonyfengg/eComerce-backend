const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("dev")); // dev combined common short tiny
app.use(helmet());
app.use(compression());

// init db

// init routes
app.get("/", (req, res) => {
  const strCompress =
    "lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nunc eget ultricies ultricies, nisl nunc ultricies elit, nec ultricies nisl elit";

  res.status(200).json({
    message: "Hello AE",
    metadata: strCompress.repeat(10000),
  });
});

// handle errors

module.exports = app;
