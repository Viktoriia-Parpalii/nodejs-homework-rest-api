const { register } = require("../../controllers/auth");
const { validateBody } = require("../../middlewares");
const {
  registerJoiSchema,
  //   loginJoiSchema,
} = require("../../schema/authSchema");

const express = require("express");
const router = express.Router();

router.post("/register", validateBody(registerJoiSchema), register);

module.exports = router;
