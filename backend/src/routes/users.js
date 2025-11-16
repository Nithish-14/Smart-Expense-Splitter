const express = require("express");
const router = express.Router();
const {
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  searchByName,
} = require("../controllers/userController");

// GET all users
router.get("/", getAllUsers);

// GET user by ID
router.get("/:id", getUserById);

// UPDATE user
router.put("/:id", updateUser);

// DELETE user
router.delete("/:id", deleteUser);

module.exports = router;
