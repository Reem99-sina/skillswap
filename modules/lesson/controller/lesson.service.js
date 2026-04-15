const { Interest } = require("../../../DB/models/interest");
const { Lesson } = require("../../../DB/models/lesson");
const { paginate } = require("../../../services/pagination");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const addLesson = async (req, res) => {
  try {
    const user = req?.user;
    if (req.fileValidationError) {
      return res.status(400).json({
        message: req.fileValidationError,
      });
    }
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];
    console.log(
      videoFile.filename,
      thumbnailFile.filename,
      "thumbnailFile.path",
      req.destination,
    );
    const lesson = await Lesson.create({
      ...req.body,
      teacher: user.id,
      video_url: videoFile ? req.destination + videoFile.filename : null,
      thumbnail: thumbnailFile
        ? req.destination + thumbnailFile.filename
        : null,
    });

    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const user = req?.user;
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // 🔒 Only owner instructor can delete
    if (user.role !== "instructor" || lesson.teacher.toString() !== user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Lesson.findByIdAndDelete(lessonId);

    res.json({ message: "Lesson deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLessonsByTags = async (req, res) => {
  try {
    const { tags, search, page, limit } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit);

    const { skip, limit: pageSize } = paginate(pageNum, limitNum);

    let query = {};

    // ✅ 1. Tags filter
    if (tags) {
      const ids = tags.split(",").map((t) => t.trim());
      query.tags = { $in: ids };
    }

    // ✅ 2. Title search (NEW)
    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    const lessons = await Lesson.find(query)
      .populate("teacher tags")
      .skip(skip)
      .limit(pageSize);

    const total = await Lesson.countDocuments(query);

    res.json({
      data: lessons,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId).populate("teacher tags");

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const { lessonId } = req.body;

    const lesson = await Lesson.findById(lessonId);
    console.log(req.user, "req?.user", lesson.credits);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 50 + lesson.credits, // in cents
      currency: "usd",
      metadata: {
        lessonId: lesson._id.toString(),
        userId: req?.user?.id,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addLesson,
  deleteLesson,
  getLessonsByTags,
  getLessonById,
  createPaymentIntent,
};
