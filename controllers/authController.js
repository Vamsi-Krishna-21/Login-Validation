const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


// REGISTER
exports.register = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    let user = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (user) return res.status(400).json("User already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json("User registered successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
// LOGIN
exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });

    if (!user) return res.status(400).json("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

//Forget Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("User not found");
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    // Simulate email (for now)
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await sendEmail(
  email,
  "Password Reset",
  `Click here to reset password: ${resetLink}`
);

res.json({ message: "Reset link sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
// Re-set password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json("Invalid or expired token");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json("Password reset successful");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};