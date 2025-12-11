const utilities = require("./index")
const {body, validationResult} = require("express-validator") //body for accessing the data sent by http request, and the validationRequest for retrieving any errors

const validate = {}


/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .isLength({min:1})
        .withMessage("Please provide a classification name")
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Classification name cannot contain a space or special characters.")
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name // "sticky"
        })
        return
    }
    next()
}

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .notEmpty()
            .withMessage("Please select a classification."),
        
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Make must be at least 3 characters."),
        
        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Model must be at least 3 characters."),
        
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required."),
        
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path is required."),
        
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required."),
        
        body("inv_price")
            .trim()
            .isDecimal()
            .withMessage("Price must be a valid decimal or integer."),

        body("inv_year")
            .trim()
            .isLength({ min: 4, max: 4 })
            .withMessage("Year must be 4 digits.")
            .isNumeric()
            .withMessage("Year must be numeric."),
        
        body("inv_miles")
            .trim()
            .isInt()
            .withMessage("Miles must be digits only."),
        
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required.")
    ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, 
            inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            classificationList,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to edit inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate
