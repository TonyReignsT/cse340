// Needed Resources
const express = require("express")
const router = new express.Router() // route object
const invController = require("../controllers/invController") // bringing in the controller
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Creating the route for the vehicle detail
router.get("/detail/:inv_id", invController.buildDetailById)

// route to build inventory management view
router.get("/", invController.buildManagement)

// route to build add classification view
router.get("/add-classification", invController.buildAddClassification)
module.exports = router

// route to process add classification
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.buildAddClassification
)


// Route to build add inventory view
router.get("/add-inventory", invController.buildAddInventory)

// Route to process add inventory (POST)
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.addInventory
)


module.exports = router