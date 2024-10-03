const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }

    const decoded = jwt.verify(token, config.secretJwtToken);
    req.user = decoded;

    req.user = user;
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
