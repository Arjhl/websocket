import express, { CookieOptions } from "express";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import { logger, upgradeLogs } from "./middleware/logger";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import connectDB from "./config/dbConfig";
import mongoose from "mongoose";
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
const port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//middlewares
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(logger);

app.use("/auth", require("./routes/auth"));
app.use(verifyLogin);

app.get("/", (req, res) => {
  console.log("hi");
});

mongoose.connection.once("open", () => {
  console.log("DB connected");
});

const s = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//websocket Code
const wss = new WebSocketServer({ noServer: true });
function onSocketPreError(e: Error) {
  console.log(e);
}

function onSocketPostError(e: Error) {
  console.log(e);
}
s.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);

  // perform auth
  //send access token through sec-websocket-protocol , then we upgrade it to websocketServer
  console.log(req.headers["sec-websocket-protocol"]);

  try {
    verifyWebsocketLogin(req.headers["sec-websocket-protocol"]);
  } catch (err) {
    console.log(err);
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  upgradeLogs(req);
  if (!!req.headers["BadAuth"]) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws, req) => {
  ws.on("error", onSocketPostError);

  console.log(req.headers);

  ws.on("message", (msg, isBinary) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg, { binary: isBinary });
      }
    });
  });

  ws.on("close", () => {
    console.log("Connection closed");
  });
});
