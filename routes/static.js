const express = require('express');
const baseController = require('../controllers/baseController');
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

// Setting up the route for the intentional error
router.get("/cause-error", (req, res, next) => {
    next(new Error("This is an intentional error for testing error handling"))
})

module.exports = router;



