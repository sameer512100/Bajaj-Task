const express = require("express");
const cors = require("cors");
const bfhlRoutes = require("./routes/bfhlRoutes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsOptions =
	allowedOrigins.length === 0
		? {}
		: {
				origin(origin, callback) {
					if (!origin || allowedOrigins.includes(origin)) {
						return callback(null, true);
					}
					return callback(new Error("Not allowed by CORS"));
				},
			};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/", bfhlRoutes);

module.exports = app;
