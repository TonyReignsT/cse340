// Needed Resources
const express = require("express")
const router = new express.Router() // route object
const invController = require("../controllers/invController") // bringing in the controller

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Creating the route for the vehicle detail
router.get("/detail/:inv_id", invController.buildDetailById)

module.exports = router