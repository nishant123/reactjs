module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: "1d",
  notBefore: "120",
  algorithm: "HS384",
};
