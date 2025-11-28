const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")


//router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/login", accountController.buildLogin)

// Registration 
router.get("/register", accountController.buildRegister)

// Enable the Registrtion Route 
router.post('/register', utilities.handleErrors(accountController.registerAccount))


module.exports = router