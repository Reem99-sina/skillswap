const express = require("express");
const { validation } = require("../../Middleware/validation");
const {
  signupSchema,
  signinSchema,
  verifyEmailSchema,
  updateProfileSchema,
} = require("./controler/user.validation");
const {
  signup,
  signin,
  verifyEmail,
  updateProfile,
  profile,
} = require("./controler/user.service");
const router = express.Router();

router.post("/signup", validation(signupSchema), signup);
router.post("/signin", validation(signinSchema), signin);
router.patch("/verify", validation(verifyEmailSchema), verifyEmail);
router.patch("/update", validation(updateProfileSchema), updateProfile);
router.get("/:id", profile);

module.exports = router;
