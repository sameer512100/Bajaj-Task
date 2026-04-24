const express = require("express");
const cors = require("cors");
const bfhlRoutes = require("./routes/bfhlRoutes");

const app = express();

const DEFAULT_ALLOWED_ORIGINS = [
  "https://bajaj-task-peach.vercel.app",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function normalizeOrigin(origin) {
  return origin.trim().replace(/\/+$/, "");
}

const allowedOrigins = [
  ...new Set(
    [...DEFAULT_ALLOWED_ORIGINS, ...(process.env.CORS_ORIGIN || "").split(",")]
	.map((origin) => origin.trim())
      .filter(Boolean)
      .map(normalizeOrigin)
  ),
];

const corsOptions =
	allowedOrigins.length === 0
		? {}
		: {
				origin(origin, callback) {
          if (!origin) {
            return callback(null, true);
          }

          if (allowedOrigins.includes(normalizeOrigin(origin))) {
						return callback(null, true);
					}

					return callback(new Error("Not allowed by CORS"));
				},
			};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use("/", bfhlRoutes);

module.exports = app;
