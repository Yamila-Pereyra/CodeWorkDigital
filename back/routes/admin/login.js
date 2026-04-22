var express = require("express");
var router = express.Router();
var asyncHandler = require("../../lib/asyncHandler");
var loginController = require("../../controllers/admin/loginController");

router.get("/", loginController.showLogin);
router.get("/logout", asyncHandler(loginController.logout));
router.post("/", asyncHandler(loginController.login));

module.exports = router;
