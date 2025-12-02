const invModel = require("../models/inventory-model")
const utilities = require("../utilities/") // HTML Builder

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}


// Loading vehicle utilities/ Details
invCont.buildDetailById = async function (req, res, next) {
    try {
        // Get the ID from the URL
        const inv_id = req.params.inv_id 

        // Quering the databse for that specified vehicle
        const vehicleData = await invModel.getVehicleById(inv_id)

        // Throw an error if no vehicle is found
        if (!vehicleData) {
            throw new Error("Vehicle not found")
        }


        // Build html for the details view
        const vehicleHTML = utilities.buildVehicleHTML(vehicleData)
        let nav = await utilities.getNav()

        // Render the EJS view
        res.render("./inventory/detail", {
            title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
            nav,
            vehicleHTML
        })
    } catch(error){
        next(error) // This line Sends the error to middleware

    }
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null
    })
}

// Build the add classification view
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null
    })
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null
    })
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, 
            inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    
    const result = await invModel.addInventory(
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    )
    
    if (result) {
        let nav = await utilities.getNav()
        req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`)
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null
        })
    } else {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        req.flash("notice", "Sorry, adding the vehicle failed.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationList,
            errors: null,
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
    }
}


module.exports = invCont