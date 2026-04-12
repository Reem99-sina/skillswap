const { Interest } = require("../../../DB/models/interest");

const createInterest = async (req, res) => {
  try {
    const { name } = req.body;

    const exist = await Interest.findOne({ name });
    if (exist) {
      return res.status(400).json({ message: "Interest already exists" });
    }

    const interest = await Interest.create({ name });

    res.status(201).json(interest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllInterests = async (req, res) => {
  try {
    const interests = await Interest.find().sort({ createdAt: -1 });

    res.json(interests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteInterest = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "instructor") {
      return res.status(403).json({ message: "Only instructors can delete interests" });
    }

    const { interestId } = req.params;

    const interest = await Interest.findByIdAndDelete(interestId);

    if (!interest) {
      return res.status(404).json({ message: "Interest not found" });
    }

    res.json({ message: "Interest deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports={
    createInterest,
    deleteInterest,
    getAllInterests,

}