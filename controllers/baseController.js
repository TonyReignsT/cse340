const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")  // The flash message. "notice" is the type of message and can also be used as a class to style the message in css
  res.render("index", {title: "Home", nav})
}

module.exports = baseController