import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

const verifyLogin = function (req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.access;
  if (!accessToken) return res.status(403);

  console.log(accessToken);
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err: Error) => {
    if (err) return res.sendStatus(403);
  });

  next();
};

const verifyWebsocketLogin = function (token: string) {
  console.log("sec token", token);
  const result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log(result);
};

module.exports = {
  verifyLogin,
  verifyWebsocketLogin,
};
