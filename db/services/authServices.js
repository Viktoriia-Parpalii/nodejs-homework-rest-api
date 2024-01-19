const { SEKRET_KEY } = process.env;

const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const User = require("../models/userModel");
const { httpError, sendEmail } = require("../../helpers");
const { BASE_URL } = process.env;

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
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        h2 {
            color: #3498db;
        }
        p {
            color: #555;
        }
        a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #3498db;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Email Confirmation</h2>
        <p>Thank you for registering. Please click the link below to confirm your email address:</p>
       <a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify your e-mail</a>
    </div>
</body>
</html>
    `,
  };
  await sendEmail(verifyEmail);
  return newUser;
};
const verifyEmailService = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw httpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
};
const resendVerifyEmailService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(404, "User not found");
  }
  if (user.verify) {
    throw httpError(401, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        h2 {
            color: #3498db;
        }
        p {
            color: #555;
        }
        a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #3498db;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Email Confirmation</h2>
        <p>Thank you for registering. Please click the link below to confirm your email address:</p>
       <a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify your e-mail</a>
    </div>
</body>
</html>
    `,
  };
  await sendEmail(verifyEmail);
};
const loginUser = async (body) => {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw httpError(401, "Your e-mail is not verified");
  }

  const passwordCompared = await bcrypt.compare(password, user.password);
  if (!passwordCompared) {
    throw httpError(401, "Email or password is wrong");
  }

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
  verifyEmailService,
  resendVerifyEmailService,
};
