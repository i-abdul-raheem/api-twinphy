const jwt = require("jsonwebtoken");

const refresh = async (req, res, next) => {
  console.log(req.user, "debug");
  const userDecoded = req.user;
  const token = jwt.sign(
    { email: userDecoded.email, id: userDecoded.id },
    process.env.SECRET_KEY,
    { expiresIn: "10m" }
  );
  console.log(token);
  next();
};

module.exports = {
  refresh,
};
