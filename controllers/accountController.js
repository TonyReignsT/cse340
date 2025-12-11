const utilities = require("../utilities")
const accountModel =  require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body

    // Hash the password before storing in the database
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error hashing the password.")
        return res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        // account_password
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "success", //"notice"
            `Congratulations, your\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
// async function buildRegister(req, res, next) {
//     let nav = await utilities.getNav()
//     res.render("account/register", {
//         title: "Register",
//         nav,
//         errors: null,
//     })
// }



/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body    // collects the incoming data from the request body.
    const accountData = await accountModel.getAccountByEmail(account_email)   // makes a call to a model-based function to locate data associated with an existing email
    if (!accountData) {  // test if nothing was returned
        req.flash("notice", "Please check your credentials and try again.")  // if variable is empty
        res.status(400).render("account/login", {
            // to be returned to view
            title: "Login",
            nav,
            errors: null,
            account_email
        })
        return  // returns control back to the project
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {      // uses the bcrypt.compare() function which takes the incoming, plain text password and the hashed password from the database and compares them to see if they match. (The plain text password is hashed using the same algorithm and secret used with the original password. The two hashes are compared to see if they match.) The resulting "TRUE" or "FALSE" is evaluated by the "if".
            delete accountData.account_password   // If the passwords match, then the JavaScript delete function is used to remove the hashed password from the accountData array.
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})   // the JWT token is created. The accountData is inserted as the payload. The secret is read from the .env file. When the token is ready, it is stored into an "accessToken" variable.
            if (process.env.NODE_ENV === 'development') {     // checks to see if the development environment is "development" (meaning local for testing). If TRUE, a new cookie is created, named "jwt", the JWT token is stored in the cookie, and the options of "httpOnly: true" and "maxAge: 3600 * 1000" are set. This means that the cookie can only be passed through the HTTP protocol and cannot be accessed by client-side JavaScript. It will also expire in 1 hour.
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600* 1000})   // if the environment is not "development", then the cookie is created with the same name and token, but with the added option of "secure: true". This means that the cookie can only be passed through HTTPS and not HTTP. This is a security measure to ensure that the cookie is not passed through an unsecured connection.
            }
            return res.redirect("/account/")  // redirects to the account management view
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

/* ****************************************
* Process Logout
* ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = {buildLogin, buildRegister, registerAccount, buildAccountManagement, accountLogin, accountLogout}