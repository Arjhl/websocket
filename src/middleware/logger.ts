import { NextFunction } from "express";
import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { format } from "date-fns";


const fsPromises = fs.promises;

const logEvents = async (message:string, logName:string) => {
  const dateTime = `${format(new Date(), "ddMMyyyy\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(`Something went wrong ${err}`);
  }
};

export const logger = (req:IncomingMessage,res:ServerResponse, next:NextFunction) => {
  logEvents(`${req.method} \t${req.headers.origin} \t${req.url}`, "reqLog.txt");
  next();
};

export const upgradeLogs = (req:IncomingMessage) => {
  logEvents(`${req.method} \t${req.headers.origin} \t${req.url}`, "upgradelogs.txt");
};


