const { register, login, logout } = require("../../controllers/auth");
const { getCurrent } = require("../../db/services/authServices");
const { validateBody, authenticate } = require("../../middlewares");
const {
  registerJoiSchema,
  loginJoiSchema,
} = require("../../schema/authSchema");

const express = require("express");
const router = express.Router();

router.post("/register", validateBody(registerJoiSchema), register);
router.post("/login", validateBody(loginJoiSchema), login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrent);

module.exports = router;
