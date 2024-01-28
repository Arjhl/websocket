import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const { handleRefreshToken } = require("../controllers/refreshtokencontroller");

const verifyLogin = function (req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.access;

  console.log(accessToken, "accessToken is present");
  if (!accessToken) return res.status(403).json("No Cookie");

  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (err) {
    res.send("Not Authorized , Login again to resolve");
  }
};

const verifyWebsocketLogin = function (token: string) {
  console.log("sec token", token);
  const result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log(result);

  //sends error for the websocket upgradation , client has to resolve it by requesting the access token
};

module.exports = {
  verifyLogin,
  verifyWebsocketLogin,
};
