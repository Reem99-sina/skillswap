const { roles } = require("../../../Middleware/auth");

module.exports.endPoint = {
  add: [roles.instructor,roles.user],
};