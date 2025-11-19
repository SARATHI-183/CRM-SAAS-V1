// src/routes/users.js
const express = require("express");
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/usersController");

const router = express.Router();


router.post("/", ctrl.createUser);

router.get("/", ctrl.listUsers);

router.get("/:id", ctrl.getUser);

router.patch("/:id", ctrl.updateUser);

router.delete("/:id", ctrl.deleteUser);

router.delete("/hard/:id", ctrl.hardDeleteUser);


module.exports = router;
