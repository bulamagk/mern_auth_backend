const router = require("express").Router();
const { login, logout } = require("../controllers/usersController");

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

module.exports = router;
