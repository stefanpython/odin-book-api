const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("TODO: -- ROUTE API HERE");
});

module.exports = router;
