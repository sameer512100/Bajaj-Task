const express = require("express");
const cors = require("cors");
const bfhlRoutes = require("./routes/bfhlRoutes");

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use("/", bfhlRoutes);

module.exports = app;
