import { Request, Response } from "express";
const User = require("../model/User");

export async function getUser(req: Request, res: Response) {
  const userId = req.query.userid;

  try {
    const response = await User.findOne({ _id: userId }).exec();
    console.log("Response of getUser", response);
    res.send(response);
  } catch (err) {
    res.status(403).send("Contact not found or wrong credentials");
  }
}

export async function getUserUsingEmail(req: Request, res: Response) {
  const email = req.query.emailId;
  console.log(email);
  try {
    const response = await User.findOne({ email: email }).exec();
    if (!response) throw new Error("Contact not found or wrong credentials");
    console.log("Response of getUserEmailId", response);
    res.send(response);
  } catch (err) {
    res.status(403).send("Contact not found or wrong credentials");
  }
}
