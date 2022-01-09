const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");

const Controller = require("../controllers/campgroundController");


const {isLoggedIn, isAuthor,validateCampground } = require("../middleware");



const {storage} = require("../cloudinary")

const multer = require("multer");
const upload = multer({storage});




router.route("/")
.get(wrapAsync(Controller.index))
.post(isLoggedIn, upload.array("image"), validateCampground,wrapAsync(Controller.createCampground))


router.get("/new",isLoggedIn,Controller.renderNewForm  
)

router.get("/:id/edit",isLoggedIn,isAuthor, wrapAsync(
    Controller.renderEditForm
))

router.route("/:id")
.get(wrapAsync(Controller.showCampground))
.put(isLoggedIn ,isAuthor ,upload.array('image'),validateCampground , wrapAsync(Controller.editCampground))
.delete(isLoggedIn,isAuthor, wrapAsync(Controller.deleteCampground))



module.exports = router;