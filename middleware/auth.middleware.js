const jwt = require("jsonwebtoken");
module.exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodeId = jwt.verify(token, process.env.SECRET_KEY);
    res.locals.userId = decodeId.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};
