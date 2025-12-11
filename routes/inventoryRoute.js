// Needed Resources
const express = require("express")
const router = new express.Router() // route object
const invController = require("../controllers/invController") // bringing in the controller
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Creating the route for the vehicle detail
router.get("/detail/:inv_id", invController.buildDetailById)

// route to build inventory management view
// router.get("/", invController.buildManagement)
router.get("/", utilities.checkAccountType, invController.buildManagement)

// route to build 
// router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// router.get("/getInventory/:classification_id", invController.getInventoryJSON)

// route to build add classification view
router.get("/add-classification", invController.buildAddClassification)


// route to process add classification
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.addClassification
)
// ------------------------------------------------------------------------------------------
/* ***************************
 *  Get inventory for AJAX Route
 *  Select inv item activity
 * ************************** */
router.get(
    "/getInventory/:classification_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON)
)
// ----------------------------------------------------------------------------------------------

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory (POST)
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.addInventory
)

/* ****************************************
 *  Route to build the Edit Inventory View
 *  (Step 1: Load vehicle data for editing)
 * ************************************ */
router.get("/edit/:inv_id", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.editInventoryView)
)


// Route to handle the update process
router.post("/update/", 
  invValidate.inventoryRules(), 
  invValidate.checkUpdateData, 
  utilities.handleErrors(invController.updateInventory)
)

/* ****************************************
 * Route to build the Delete Confirmation View
 * ************************************ */
router.get("/delete/:inv_id", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteView)
)

/* ****************************************
 * Route to delete the inventory item
 * ************************************ */
router.post("/delete", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteInventory)
)


module.exports = router