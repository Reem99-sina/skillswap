const Joi = require("joi");

const addLessonSchema = {
  body: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    duration: Joi.number().positive().required(),

    credits: Joi.number().min(0).optional(),

    category: Joi.string(),

    difficulty: Joi.string()
      .valid("Beginner", "Intermediate", "Expert")
      .optional(),

    tags: Joi.array()
      .items(Joi.string().hex().length(24))
      .optional(),
  }),
};

const deleteLessonSchema = {
  params: Joi.object({
    lessonId: Joi.string().hex().length(24).required(),
  }),
};

const getLessonsByTagsSchema = {
  query: Joi.object({
    tags: Joi.string()
      .optional(),

    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(50).optional(),
    search:Joi.string()
      .optional(),
  }),
};

const getLessonByIdSchema = {
  params: Joi.object({
    lessonId: Joi.string().hex().length(24).required(),
  }),
};

const paymentIntent = {
  body: Joi.object({
    lessonId: Joi.string().hex().length(24).required(),
  }),
};

module.exports={
    addLessonSchema,
    paymentIntent,
    deleteLessonSchema,
    getLessonByIdSchema,
    getLessonsByTagsSchema
}