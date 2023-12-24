const User = require("../models/userModel");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { httpError } = require("../../helpers");
// const { SEKRET_KEY } = process.env;

const createUser = async (body) => {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (user) throw httpError(409, "Email in use");

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create(...body, hashPassword);
  return newUser;
};
module.exports = {
  createUser,
};
