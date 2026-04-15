const { Schema, default: mongoose } = require("mongoose");

const lessonSchema = new Schema(
  {
    title: { type: String, required: true },

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    thumbnail: String,
    video_url: String,

    duration: { type: Number, required: true },

    credits: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },

    category: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
      default: "Beginner",
    },

    aiMatch: { type: Number, default: 0 },

    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Interest",
      },
    ],
  
  },
  { timestamps: true },
);

module.exports.Lesson = mongoose.model("Lesson", lessonSchema);
