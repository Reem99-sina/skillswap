const express = require("express");
const { validation } = require("../../Middleware/validation");
const { auth, roles } = require("../../Middleware/auth");
const {
  addLesson,
  deleteLesson,
  getLessonsByTags,
  getLessonById,
  createPaymentIntent,
} = require("./controller/lesson.service");
const {
  addLessonSchema,
  deleteLessonSchema,
  getLessonsByTagsSchema,
  getLessonByIdSchema,
  paymentIntent,
} = require("./controller/lesson.validation");
const { endPoint } = require("./controller/lesson.endpoint");
const { myMulter, filetype } = require("../../services/multer");

const router = express.Router();

router.post(
  "/create",
  myMulter("lessons", filetype.mixed).fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validation(addLessonSchema),
  auth(endPoint.add),
  addLesson,
);

router.delete(
  "/lessons/:lessonId",
  validation(deleteLessonSchema),
  auth(endPoint.add),
  deleteLesson,
);

router.get("/lessons", validation(getLessonsByTagsSchema), getLessonsByTags);

router.get(
  "/lessons/:lessonId",
  validation(getLessonByIdSchema),
  getLessonById,
);

router.post(
  "/payments/create-intent",

  validation(paymentIntent),
    auth(endPoint.all),
  createPaymentIntent,
);

module.exports = router;
