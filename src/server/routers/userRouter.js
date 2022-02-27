const express = require("express");
const multer = require("multer");
const { userLogin, userRegister } = require("../controllers/userController");

const upload = multer({ dest: "uploads" });

const router = express.Router();

router.post("/login", userLogin);
router.post("/register", upload.single("picture"), userRegister);

module.exports = router;
