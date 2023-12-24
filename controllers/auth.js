const { createUser } = require("../db/services/authServices");
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

module.exports = {
  register: tryCatch(register),
};
