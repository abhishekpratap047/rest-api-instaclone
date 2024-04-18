const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { isEmail, hasPassword, hasName } = require("../validations/validators");


router.get("/login", authController.login);
router.post("/signup", [isEmail, hasPassword, hasName], authController.signup);
router.get("/me", authController.me);
module.exports = router;
