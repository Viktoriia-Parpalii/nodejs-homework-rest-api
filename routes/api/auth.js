const {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  updateSunscription,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/auth");

const { validateBody, authenticate, upload } = require("../../middlewares");

const {
  registerJoiSchema,
  EmailSchema,
  loginJoiSchema,
} = require("../../schema/authSchema");

const express = require("express");
const router = express.Router();

// *SignUp
router.post("/register", validateBody(registerJoiSchema), register);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", validateBody(EmailSchema), resendVerifyEmail);

// *SignIp
router.post("/login", validateBody(loginJoiSchema), login);
// *LogOut
router.post("/logout", authenticate, logout);
// *Current
router.get("/current", authenticate, getCurrent);

// *Updates
router.patch("/", authenticate, updateSunscription);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  updateAvatar
);

module.exports = router;
