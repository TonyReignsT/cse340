const utilities = require("./index")
const {body, validationResult} = require("express-validator") //body for accessing the data sent by http request, and the validationRequest for retrieving any errors

const validate = {}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
 validate.registrationRules = () => {
    return [
        // first name is required and must be a string
        body("account_firstname")
        .trim()
        .escape() //finds any special character and transform it to an HTML Entity rendering it not operational as code
        .notEmpty()
        .isLength({min:1})
        .withMessage("Please provide  last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .notEmpty()
        .isEmail()
        .normalizeEmail() //refer to validator.js docs
        .withMessage("A valid email is required."),

        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
 }


 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
// Implementing "stickiness"
validate.checkRegData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body // (destructuring to collect and store the data) the variables will be used to repopulate the form
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return  // sends control of the process back to the application, so the view in the browser does not "hang"
    }
    next()
}

/* ****************************************
 * Login Data Validation Rules
 * **************************************** */
validate.loginRules = () => {
    return [
        //valid email is required
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required"),

        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("A valid email is required"),
     ]
 }


 /* ****************************************
 * Check login data and return errors or continue to login
 * **************************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

module.exports = validate
