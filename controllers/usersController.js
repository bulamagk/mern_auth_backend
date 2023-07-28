const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const User = require("../models/usersModel");
const generateToken = require("../utils/generateToken");

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  } else {
    const user = await User.create({ name, email, password });
    generateToken(res, user._id);
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  }
});

// Get Users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

// Get Single User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  } else {
    res.status(200).json(user);
  }
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  } else {
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = password;
    }
  }

  const updatedUser = await user.save();
  res.status(200).json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  });
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  } else {
    await user.deleteOne();
    res.status(200).json({ message: "User Deleted Successfully" });
  }
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id);
    res.status(200).json({ id: user._id, name: user.name, email: user.email });
  } else {
    res.status(400);
    throw new Error("Wrong Email or Password");
  }
});

// Logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "User Logged Out" });
});

module.exports = {
  registerUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  login,
  logout,
};
