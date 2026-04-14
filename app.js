const express = require("express");
const { connectdb } = require("./DB/connectDB");
const {
  userRouter,
  lessonRouter,
  interestRouter,
  pathRouter,
} = require("./modules/router");
const path = require("path");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();
app.use("/user", userRouter);
app.use("/lesson", lessonRouter);
app.use("/interest", interestRouter);
app.use("/path", pathRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/picture", express.static("./uploads/lessons"));
app.use("/uploads/videos", express.static("./uploads/video"));
connectdb();

app.listen(process.env.PORT||"3000", () => {
  console.log("server is running on port");
});
