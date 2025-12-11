const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")


// router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// router.get("/login", accountController.buildLogin)

// Registration 
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// router.get("/register", accountController.buildRegister)

// A new default route for account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Process the registration data and Enable the Registrtion Route
router.post(
    '/register',  // path being watched for in the route
    regValidate.registrationRules(), // contains the rules to be used in the validation process
    regValidate.checkRegData,  // check validation and handle errors
    utilities.handleErrors(accountController.registerAccount))  // calls the controller to handle the registration, if no errors occur in the validation process

// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)


// Route to handle logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

module.exports = router