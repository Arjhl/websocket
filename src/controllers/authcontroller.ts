const jwt = require("jsonwebtoken");
import { Request, Response } from "express";
const bcrypt = require("bcrypt");
const User = require("../model/User");
const Contact = require("../model/Contacts");

const signupHandler = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  console.log(email, username, password);

  const duplicate = await User.findOne({ email: email }).exec();

  if (duplicate) return res.sendStatus(409);

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    //store the new user
    const newUser = await User.create({
      email: email,
      username: username,
      password: hashedPwd,
    });

    const newContact = await Contact.create({
      user_id: newUser._id,
      contacts: [],
    });

    console.log("new users and new contact", newUser, newContact);

    res.status(201).json({ success: `New user ${newUser.email} created!` });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and Password are required" });

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) return res.sendStatus(401);

  console.log(foundUser);

  //evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    //create JWTs
    const accessToken = jwt.sign(
      {
        email: foundUser.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    // const resData = currentUser.id;
    res.cookie("access", accessToken);
    console.log(accessToken);
    res.status(200).json({ _id: foundUser._id, username: foundUser.username });
  } else {
    res.sendStatus(401);
  }
};

const logoutHandler = async (req: Request, res: Response) => {
  // res.send(JSON.stringify({req?.cookies.access, req?.cookies.jwt}));
  console.log(req.cookies);
  res.clearCookie("access");
  res.clearCookie("jwt");
  res.end();
};

module.exports = {
  signupHandler,
  loginHandler,
  logoutHandler,
};
