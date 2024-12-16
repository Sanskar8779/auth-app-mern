const { signUp, login } = require("../Controllers/AuthController");
const {
	signupValidation,
	loginValidation,
} = require("../Middlewares/AuthValidation");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signUp);

module.exports = router;
