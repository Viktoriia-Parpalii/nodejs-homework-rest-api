const {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  updateSunscription,
} = require("../../controllers/auth");

const { validateBody, authenticate, upload } = require("../../middlewares");

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
router.patch("/", authenticate, updateSunscription);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  updateAvatar
);

module.exports = router;
