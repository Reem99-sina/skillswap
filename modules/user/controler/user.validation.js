const Joi = require("joi");

const signupSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "string.base": "name must be a string",
      "string.empty": "name is required",
      "string.min": "name must be at least 3 characters",
      "any.required": "name is required",
    }),

    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),

    password: Joi.string().min(6).max(100).required(),

    skill_level: Joi.string()
      .valid("Beginner", "Intermediate", "Advanced")
      .optional(),
    role: Joi.string().valid("user", "instructor").optional(),
    interests: Joi.array()
      .items(Joi.string().hex().length(24)) // MongoDB ObjectId
      .optional(),
  }),
};

const verifyEmailSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),

    code: Joi.string()
      .length(4)
      .pattern(/^[0-9]+$/)
      .required(),
  }),
};

const signinSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),

    password: Joi.string().min(6).required(),
  }),
};

const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50),

    skill_level: Joi.string().valid("Beginner", "Intermediate", "Advanced"),

    interests: Joi.array().items(Joi.string().hex().length(24)),

    profile_picture: Joi.string().uri().allow(""),
  }),
};

module.exports = {
  signupSchema,
  verifyEmailSchema,
  signinSchema,
  updateProfileSchema,
};
