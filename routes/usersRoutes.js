const router = require("express").Router();
const {
  registerUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const { protect } = require("../middlewares/authMiddleware");

// Register
router.post("/", registerUser);

// All Users
router.get("/", protect, getUsers);

// Single User
router.get("/:id", protect, getUser);

// Update User
router.put("/:id", protect, updateUser);

// Delete User
router.delete("/:id", protect, deleteUser);

module.exports = router;
