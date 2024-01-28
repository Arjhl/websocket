const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
import { Request, Response } from "express";

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  try {
    if (!cookies?.jwt) throw new Error("Refresh token not available");
    console.log(cookies.jwt);

    const refreshToken = cookies.jwt;

    const foundUser = await User.find({ refreshToken }).exec();

    if (!foundUser) throw new Error("Refresh token is not valid");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      {
        email: foundUser.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("access", accessToken);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { handleRefreshToken };
