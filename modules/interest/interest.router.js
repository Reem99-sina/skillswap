const express = require("express");
const router = express.Router();

const {
  createInterest,
  getAllInterests,
  deleteInterest,
} = require("./controller/interest.service");

const {
  createInterestSchema,
  deleteInterestSchema,
} = require("../interest/controller/interest.validation");
const { auth } = require("../../Middleware/auth");
const { validation } = require("../../Middleware/validation");
const {endPoint}=require("./controller/interest.endpoit")

router.post(
  "/create",
  validation(createInterestSchema),
  auth(endPoint.add),
  createInterest
);

router.get("/interests", getAllInterests);

router.delete(
  "/interests/:interestId",
  validation(deleteInterestSchema),
  auth(endPoint.add),
  deleteInterest
);

module.exports = router;