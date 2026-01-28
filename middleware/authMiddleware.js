import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("token:", token);
  if (token == null)
    return res
      .status(401)
      .json({ message: "not authorized, token not provided or expired" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    console.log("payload:", payload);
    if (err)
      return res.status(401).json({ message: "not authorized, invalid token" });
    req.id = payload.id;
    next();
  });
};
