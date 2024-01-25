const Joi = require("joi");

const registerJoiSchema = Joi.object({
  email: Joi.string().min(6).required(),
  password: Joi.string().required().min(6),
});
const EmailSchema = Joi.object({
  email: Joi.string().min(6).required(),
});
const loginJoiSchema = Joi.object({
  email: Joi.string().min(6).required(),
  password: Joi.string().required().min(6),
});

module.exports = { registerJoiSchema, loginJoiSchema, EmailSchema };
