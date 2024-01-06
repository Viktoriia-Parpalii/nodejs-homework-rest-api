const {
  createUser,
  loginUser,
  logoutUser,
  changeAvatar,
} = require("../db/services/authServices");

const { tryCatch } = require("../helpers");

const register = async (req, res) => {
  const newUser = await createUser(req.body);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: "starter",
    },
  });
};
const login = async (req, res) => {
  const userUpdated = await loginUser(req.body);
  res.json({
    token: userUpdated.token,
    user: {
      email: userUpdated.email,
      subscription: userUpdated.subscription,
    },
  });
};
const logout = async (req, res) => {
  await logoutUser(req.user);
  res.status(204).json();
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const updateAvatar = async (req, res) => {
  const avatarURL = await changeAvatar(req.file, req.user);

  res.status(200).json({ avatarURL });
};

module.exports = {
  register: tryCatch(register),
  login: tryCatch(login),
  logout: tryCatch(logout),
  getCurrent: tryCatch(getCurrent),
  updateAvatar: tryCatch(updateAvatar),
};
