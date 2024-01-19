const { SEKRET_KEY } = process.env;

const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const User = require("../models/userModel");
const { httpError } = require("../../helpers");

const SubscriptionEnum = {
  Starter: "starter",
  Pro: "pro",
  Business: "business",
};
const avatarsDir = path.join(__dirname, "../", "../", "public", "avatars");

const createUser = async (body) => {
  const { email, password } = body;
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email);

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...body,
    password: hashPassword,
    avatarURL,
  });

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
  const userUpdated = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );
  return userUpdated;
};

const logoutUser = async (user) => {
  const { _id } = user;
  await User.findByIdAndUpdate(_id, { token: "" });
};

const changeSunscription = async (id, subscription) => {
  if (
    subscription !== SubscriptionEnum.Starter &&
    subscription !== SubscriptionEnum.Pro &&
    subscription !== SubscriptionEnum.Business
  ) {
    throw httpError(400, "Invalid subscription");
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  );
  return updatedUser;
};

const changeAvatar = async (file, user) => {
  if (!file) {
    throw httpError(400, "File upload error");
  }
  const { _id } = user;
  const { path: tempUpload, originalname } = file;
  const fileName = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, fileName);
  await fs.rename(tempUpload, resultUpload);

  const image = await Jimp.read(resultUpload);
  await image.contain(250, 250);
  await image.writeAsync(resultUpload);

  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  return avatarURL;
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  changeSunscription,
  changeAvatar,
};
