const { createUserSchema, updateUserSchema } = require("./users.validator");
const usersService = require("./users.service");

// Middleware to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// -------------------------
// CREATE USER
// -------------------------
const createUser = asyncHandler(async (req, res) => {
  await createUserSchema.validate(req.body, { abortEarly: false });
  const user = await usersService.createUser(req.user, req.body);
  res.status(201).json(user);
});

// -------------------------
// LIST USERS
// -------------------------
const listUsers = asyncHandler(async (req, res) => {
  const users = await usersService.listUsers(req.user, req.query);
  res.json(users);
});

// -------------------------
// GET USER
// -------------------------
const getUser = asyncHandler(async (req, res) => {
  const user = await usersService.getUser(req.user, req.params.id);
  res.json(user);
});

// -------------------------
// UPDATE USER
// -------------------------
const updateUser = asyncHandler(async (req, res) => {
  await updateUserSchema.validate(req.body, { abortEarly: false });
  const updated = await usersService.updateUser(req.user, req.params.id, req.body);
  res.json(updated);
});

// -------------------------
// DEACTIVATE USER
// -------------------------
const deleteUser = asyncHandler(async (req, res) => {
  const deactivated = await usersService.deleteUser(req.user, req.params.id);
  res.json(deactivated);
});

// -------------------------
// HARD DELETE USER
// -------------------------
const hardDeleteUser = asyncHandler(async (req, res) => {
  const deleted = await usersService.hardDeleteUser(req.user, req.params.id);
  res.json(deleted);
});

module.exports = {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  hardDeleteUser,
};
