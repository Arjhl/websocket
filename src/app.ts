import express, { CookieOptions } from "express";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import { logger, upgradeLogs } from "./middleware/logger";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import connectDB from "./config/dbConfig";
import mongoose from "mongoose";
import { messageHandler } from "./helpers/websockethelper";

const {
  verifyLogin,
  verifyWebsocketLogin,
} = require("./middleware/verifyLogin");
const bodyParser = require("body-parser");

var whitelist = ["http://example1.com", "http://example2.com"];

// var corsOptions = {
//   origin: function (origin : any, callback:Function) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
let corsOptions = {
  origin: "*",
};
//config
configDotenv();
connectDB();
const app = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//middlewares
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(logger);

app.use("/auth", require("./routes/auth"));
app.use(verifyLogin);

app.get("/", (req, res) => {
  console.log("hi");
});
app.use("/user", require("./routes/user"));
app.use("/contact", require("./routes/contacts"));
app.use("/message", require("./routes/message"));
mongoose.connection.once("open", () => {
  console.log("DB connected");
});

const s = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//websocket Code
export const wss = new WebSocketServer({ noServer: true });
function SocketError(e: Error) {
  console.log(e);
}

const connections: any = {};
s.on("upgrade", (req, socket, head) => {
  socket.on("error", SocketError);

  upgradeLogs(req);
  try {
    console.log("ws cookie", req.headers.cookie);
    // verifyWebsocketLogin(req.headers["sec-websocket-protocol"]);
  } catch (err) {
    console.log(err);
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", SocketError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws: WebSocket, req) => {
  ws.on("error", SocketError);
  ws.send(JSON.stringify({ message: "Connection established" }));
  const user_id = req.headers["sec-websocket-protocol"];
  // wss.clients.forEach((client) => {
  //   connections[user_id ? user_id.toString() : ""] = client;
  // });
  connections[user_id ? user_id.toString() : ""] = ws;

  ws.on("message", (msg, isBinary) => {
    //messagehandler
    messageHandler(msg, connections);
  });

  ws.on("close", () => {
    console.log("Connection closed");
  });
});
