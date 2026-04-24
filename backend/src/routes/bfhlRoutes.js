const express = require("express");
const { postBfhl, getHealth } = require("../controllers/bfhlController");

const router = express.Router();

router.get("/", getHealth);
router.post("/bfhl", postBfhl);

module.exports = router;
