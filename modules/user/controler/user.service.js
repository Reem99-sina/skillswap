const { User } = require("../../../DB/models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { sendCodeEmail } = require("../../../services/sendEmail");
const { GenerateToken } = require("../../../services/token");

const signup = async (req, res) => {
  try {
    const { name, email, password, skill_level, interests,role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User exists" });

    const code = crypto.randomInt(1000, 9999).toString();

    const user = await User.create({
      name,
      email,
      password,
      skill_level,
      interests,
      verifyCode: code,
      verifyCodeExpire: Date.now() + 10 * 60 * 1000,
      role
    });

    await sendCodeEmail({to:email, code:code});

    res.json({
      message: "Check email for verification code",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOneAndUpdate(
    {
      email,
      verifyCode: code,
      verifyCodeExpire: { $gte: Date.now() }, // not expired
    },
    {
      $set: {
        isVerified: true,
      },
      $unset: {
        verifyCode: 1,
        verifyCodeExpire: 1,
      },
    },
    { new: true },
  );

  if (!user) {
    return res.status(400).json({
      message: "Invalid code or expired or user not found",
    });
  }

  res.json({ message: "Email verified successfully" });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (!user.isVerified)
    return res.status(400).json({ message: "Verify your email first" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
console.log(user,'user')
  const token = GenerateToken(user._id);
  const { password: _, ...userData } = user.toObject();

  res.json({
    user: userData,
    token,
  });
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { lessons, ...otherData } = req.body;

  const updateQuery = {
    ...otherData,
  };

  if (lessons) {
    updateQuery.$addToSet = {
      lessons: Array.isArray(lessons) ? { $each: lessons } : lessons,
    };
  }
  const updated = await User.findByIdAndUpdate(userId, updateQuery, {
    new: true,
  }).populate("lessons");

  res.json(updated);
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { signup, verifyEmail, signin, updateProfile, profile };
