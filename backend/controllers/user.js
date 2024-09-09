require("dotenv").config();
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const axios = require("axios");
const {
  fetchAndSavePublications,
  validateAuthorID,
} = require("./scopusIntegration");
const jwtSecret = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL;

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  let foundUser = await Teacher.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res
        .status(200)
        .json({ msg: "User logged in successfully", token });
    } else {
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentails" });
  }
};

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

const getAllUsers = async (req, res) => {
  let users = await Teacher.find({});

  return res.status(200).json({ users });
};

const register = async (req, res) => {
  try {
    let foundUser = await Teacher.findOne({ email: req.body.email });
    if (foundUser === null) {
      let { username, email, password, department, authorID, domains } =
        req.body;
      if (
        username.length &&
        email.length &&
        password.length &&
        domains.length
      ) {
        const isValidAuthorID = await validateAuthorID(authorID);
        if (!isValidAuthorID) {
          return res.status(400).json({ msg: "Invalid Author ID" });
        }
        const person = new Teacher({
          name: username,
          email: email,
          password: password,
          department: department,
          authorID: authorID,
          domains: domains,
        });
        await person.save();
        await fetchAndSavePublications(person, authorID);
        const token = jwt.sign(
          { id: person._id, name: person.name },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
        const welcomeMessage = `
Dear ${username},
Welcome to the LNMIIT Research Portal!
Thank you for registering with us. Your account is now active, and you can start exploring the platform.
We're excited to have you on board and look forward to seeing your contributions to the LNMIIT research community!
Best regards,
The LNMIIT Research Portal Team
        `;
        try {
          await sendEmail({
            email: email,
            subject: "Welcome to LNMIIT Research Portal",
            message: welcomeMessage,
          });
          console.log("Welcome email sent successfully");
        } catch (emailError) {
          console.error("Error sending welcome email:", emailError);
        }
        return res.status(201).json({ person, token });
      } else {
        return res
          .status(400)
          .json({ msg: "Please add all values in the request body" });
      }
    } else {
      return res.status(400).json({ msg: "Email already in use" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await Teacher.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();
  const resetUrl = `${BASE_URL}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(500).json({ msg: "Email could not be sent" });
  }
};

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await Teacher.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ msg: "Invalid token" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id, name: user.name }, jwtSecret, {
    expiresIn: "30d",
  });

  res.status(200).json({ success: true, token });
};

const refreshPublications = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Teacher.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log(user);

    if (!user.authorID) {
      return res
        .status(400)
        .json({ success: false, message: "User does not have an author ID" });
    }

    await fetchAndSavePublications(user, user.authorID);
    res
      .status(200)
      .json({ success: true, message: "Publications refreshed successfully" });
  } catch (error) {
    console.error("Error refreshing publications:", error);
    res
      .status(500)
      .json({ success: false, message: "Error refreshing publications" });
  }
};

module.exports = {
  login,
  register,
  dashboard,
  getAllUsers,
  forgotPassword,
  resetPassword,
  refreshPublications,
};
