const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const interestSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
  },
  { timestamps: true },
);

module.exports.Interest = mongoose.model("Interest", interestSchema);
