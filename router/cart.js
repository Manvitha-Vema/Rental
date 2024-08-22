const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const cartController = require("../controller/cart.js");

router.route("/").get(isLoggedIn, wrapAsync(cartController.getCart));
router.route("/add").post(isLoggedIn, wrapAsync(cartController.saveCart));
module.exports = router;
