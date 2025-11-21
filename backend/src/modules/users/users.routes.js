
// const usersController = require("./users.controller");
// const usersValidator = require("./users.validator");


// // Create user
// router.post("/", usersValidator.createUser, usersController.createUser);

// // List users (optional tenant filter for super_admin)
// router.get("/", usersController.listUsers);

// // Get single user
// router.get("/:id", usersValidator.getUser, usersController.getUser);

// // Update user
// router.put("/:id", usersValidator.updateUser, usersController.updateUser);

// // Soft delete user
// router.delete("/:id", usersValidator.deleteUser, usersController.deleteUser);

// // Hard delete user
// router.delete("/:id/hard", usersValidator.hardDeleteUser, usersController.hardDeleteUser);

// module.exports = router;

// src/modules/users/users.routes.js

// Controllers

const express = require("express");
const router = express.Router();

const {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  hardDeleteUser,
} = require("./users.controller");

// ROUTES

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", listUsers);

// Get single user by ID
router.get("/:id", getUser);

// Update user by ID
router.put("/:id", updateUser);

// Soft delete (deactivate) user
router.delete("/:id", deleteUser);

// Hard delete user
router.delete("/:id/hard", hardDeleteUser);

module.exports = router;
