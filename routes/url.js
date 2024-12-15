const express = require("express");
const router = express.Router();
const urlController = require("../controllers/url");

router.post("/create", urlController);
module.exports = router;
