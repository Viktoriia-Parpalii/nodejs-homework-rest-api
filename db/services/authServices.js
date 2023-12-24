const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { SEKRET_KEY } = process.env;
const jwt = require("jsonwebtoken");
const { httpError } = require("../../helpers");

const createUser = async (body) => {
  const { email, password } = body;
  const user = await User.findOne({ email });
  if (user) throw httpError(409, "Email in use");

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...body, password: hashPassword });
  return newUser;
};

const loginUser = async (body) => {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) throw httpError(401, "Email or password is wrong");

  const passwordCompared = await bcrypt.compare(password, user.password);
  if (!passwordCompared) throw httpError(401, "Email or password is wrong");

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SEKRET_KEY, { expiresIn: "24h" });
  const userUpdated = await User.findByIdAndUpdate(user._id, { token });
  return userUpdated;
};

const logoutUser = async (user) => {
  const { _id } = user;
  await User.findByIdAndUpdate(_id, { token: "" });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getCurrent,
};
