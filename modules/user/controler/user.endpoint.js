const { roles } = require("../../../Middleware/auth");

module.exports.endPoint = {
  user: [roles.user, roles.instructor],
};
