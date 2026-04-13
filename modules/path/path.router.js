const express = require("express");
const { auth } = require("../../Middleware/auth");
const {
  createPath,
  getUserPaths,
  getPathById,
  updatePathProgress,
} = require("./controller/path.service");
const { endPoint } = require("./controller/path.endpoint");
const { validation } = require("../../Middleware/validation");
const {
  createPathSchema,
  getUserPathsSchema,
  getPathByIdSchema,
  updatePathProgressSchema,
} = require("./controller/path.validation");
const router = express.Router();

router.post(
  "/create",
  auth(endPoint.add),
  validation(createPathSchema),
  createPath,
);
router.get(
  "/my-paths",
  auth(endPoint.add),
  validation(getUserPathsSchema),
  getUserPaths,
);
router.get(
  "/:id",
  auth(endPoint.add),
  validation(getPathByIdSchema),
  getPathById,
);
router.patch(
  "/progress",
  auth(endPoint.add),
  validation(updatePathProgressSchema),
  updatePathProgress,
);

module.exports = router;
