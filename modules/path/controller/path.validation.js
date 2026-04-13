const Joi = require("joi");

const createPathSchema = {
  body: Joi.object({
    title: Joi.string().min(3).max(100).required(),

    description: Joi.string().min(5).max(500).required(),

    lessonIds: Joi.array()
      .items(Joi.string().hex().length(24))
      .min(1)
      .required(),
  }),
};

const updatePathProgressSchema = {
  body: Joi.object({
    pathId: Joi.string().hex().length(24).required(),

    progress: Joi.number().min(0).max(100).required(),
  }),
};

const getPathByIdSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

const getUserPathsSchema = {
  query: Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(50).optional(),
  }),
};

module.exports={
   createPathSchema,
   updatePathProgressSchema,
   getPathByIdSchema,
   getUserPathsSchema
}