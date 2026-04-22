var express = require("express");
var router = express.Router();
var asyncHandler = require("../../lib/asyncHandler");
var novedadesController = require("../../controllers/admin/novedadesController");

router.get("/", asyncHandler(novedadesController.list));
router.get("/agregar", novedadesController.showAddForm);
router.post("/agregar", asyncHandler(novedadesController.create));
router.post("/eliminar/:id", asyncHandler(novedadesController.remove));
router.get("/modificar/:id", asyncHandler(novedadesController.showEditForm));
router.post("/modificar", asyncHandler(novedadesController.update));

module.exports = router;
