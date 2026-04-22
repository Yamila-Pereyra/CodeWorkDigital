var express = require("express");
var router = express.Router();
var asyncHandler = require("../lib/asyncHandler");
var apiController = require("../controllers/apiController");

router.get("/novedades", asyncHandler(apiController.getNovedades));
router.post("/contacto", asyncHandler(apiController.postContacto));

module.exports = router;
