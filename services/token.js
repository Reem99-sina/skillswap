const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const GenerateToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
module.exports = { GenerateToken };
