const { Lesson } = require("../../../DB/models/lesson");
const { Path } = require("../../../DB/models/path");

const createPath = async (req, res) => {
  try {
    const userId = req.user.id;

    const { title, description, lessonIds } = req.body;
    const lesson = await Lesson.findById(lessonIds);
    if (!lesson) res.status(401).json({ message: "not found lesson" });

    const path = await Path.create({
      title,
      description,
      user: userId,
      lessons: lessonIds, // array of lesson IDs
    });

    res.status(201).json(path);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserPaths = async (req, res) => {
  try {
    const userId = req.user.id;

    const paths = await Path.find({ user: userId })
      .populate("lessons")
      .sort({ createdAt: -1 });

    res.json(paths);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPathById = async (req, res) => {
  try {
    const { id } = req.params;

    const path = await Path.findById(id).populate("lessons");

    if (!path) {
      return res.status(404).json({ message: "Path not found" });
    }

    res.json(path);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePathProgress = async (req, res) => {
  try {
    const { pathId, progress } = req.body;

    const path = await Path.findByIdAndUpdate(
      pathId,
      { progress },
      { new: true }
    );

    res.json(path);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPath,
  updatePathProgress,
  getPathById,
  getUserPaths
};