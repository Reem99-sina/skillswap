const mongoose = require("mongoose");

const { Schema } = mongoose;

const pathSchema = new Schema(
  {
    title: { type: String, required: true },
  

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    progress: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports.Path = mongoose.model("Path", pathSchema);