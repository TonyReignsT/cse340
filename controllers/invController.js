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

module.exports = invCont