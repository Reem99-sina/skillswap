const Joi = require("joi");

const createInterestSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(50).required(),
  }),
};

const deleteInterestSchema = {
  params: Joi.object({
    interestId: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  createInterestSchema,
  deleteInterestSchema,
};