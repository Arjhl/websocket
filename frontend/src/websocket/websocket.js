import { v4 as uuid } from "uuid";
export default class Socket {
  constructor() {
    this.ws = new WebSocket("ws://localhost:8080", [
      localStorage.getItem("id"),
    ]);

    this.ws.onopen = () => {
      console.log("Connected to server");
    };
    this.ws.onclose = () => {
      console.log("Disconnected from server");
    };

    this.sendReadStatus = (message) => {
      this.ws.send(JSON.stringify(message));
    };

    this.sendMessage = (message, participants, id) => {
      const sender = localStorage.getItem("username");
      const sender_id = localStorage.getItem("id");
      const timeStamp = new Date();

      console.log({
        sender: sender,
        sender_id: sender_id,
        participants: participants,
        message: message,
        timeStamp: timeStamp,
        messageId: uuid(),
      });

      this.ws.send(
        JSON.stringify({
          sender: sender,
          sender_id: sender_id,
          participants: participants,
          message: message,
          timeStamp: timeStamp,
          msgid: id,
          messageId: uuid(),
          read: false,
        })
      );
    };
  }
}
