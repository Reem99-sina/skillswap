const { Lesson } = require("../../../DB/models/lesson");
const { Path } = require("../../../DB/models/path");

const createPath = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, lessonIds } = req.body;

    // 1. validate lessons exist
    const lessons = await Lesson.findById(lessonIds);

    if (!lessons) {
      return res.status(404).json({ message: "No lesson found" });
    }

    // 2. check if user already has a path
    let path = await Path.findOne({ user: userId });

    if (path) {
    
      const existingIds = path.lessons.map((id) => id.toString());

      const newUniqueLessons = !existingIds.includes(lessonIds);
      
      if (newUniqueLessons) {
        path.lessons.push(lessonIds);
      }

      if (title) {
        path.title = title; // optional update title
      }

      await path.save();

      return res.status(200).json({
        message: "Path updated successfully",
        path,
      });
    }

    // 3. CREATE NEW PATH
    path = await Path.create({
      title,
      user: userId,
      lessons: lessonIds,
    });

    return res.status(201).json({
      message: "Path created successfully",
      path,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
      { new: true },
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
  getUserPaths,
};
