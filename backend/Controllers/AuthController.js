const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//we use async with signup and login because it allows the application to continue responding to user interactions while the signup data is being processed on the backend, preventing the user interface from freezing and providing a more seamless experience, especially when tasks like email verification or database checks are involved, which can take time to complete.
const signUp = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const user = await UserModel.findOne({ email });
		if (user) {
			return res
				.status(409)
				.json({ message: "User already exists", success: false });
		}
		const userModel = new UserModel({ name, email, password });
		userModel.password = await bcrypt.hash(password, 10);
		await userModel.save();
		res.status(201).json({ message: "SignUp successful", success: true });
	} catch (err) {
		res.status(500).json({
			message: "Internal Server Error",
			success: false,
		});
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await UserModel.findOne({ email });
		const errorMsg = "Auth Failed, email or password is wrong";
		if (!user) {
			return res.status(403).json({ message: errorMsg, success: false });
		}
		const isPassEqual = await bcrypt.compare(password, user.password);
		if (!isPassEqual) {
			return res.status(403).json({ message: errorMsg, success: false });
		}
		const jwtToken = jwt.sign(
			{ email: user.email, _id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		res.status(200).json({
			message: "Login successful",
			success: true,
			jwtToken,
			email,
			name: user.name,
		});
	} catch (err) {
		res.status(500).json({
			message: "Internal Server Error",
			success: false,
		});
	}
};

module.exports = {
	signUp,
	login,
};
