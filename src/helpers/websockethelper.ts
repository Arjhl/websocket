import { RawData, WebSocket } from "ws";
import { WsMessageType } from "../types/MessageObjectTypes";
import { putMessages, updateMessage } from "../controllers/messageController";
const Contact = require("../model/Contacts");

// messagestatus = msgobjid ,messageid , messageStatus , userid(to know who read it)

export const messageHandler = (message: RawData, connections: any) => {
  //message  = msgObj + msgid
  // console.log("message value", JSON.parse(message.toString()));
  const receivedMessage: WsMessageType | any = JSON.parse(message.toString());

  //   connections["Arjun"].send("Hello");

  if (receivedMessage.status) {
    // update read status,updatemessagefunction should be called
    const rm = receivedMessage;
    updateMessage(rm, connections);
    return;
  }

  putMessages(
    {
      sender: receivedMessage.sender,
      message: receivedMessage.message,
      sender_id: receivedMessage.sender_id,
      participants: receivedMessage.participants,
      timeStamp: receivedMessage.timeStamp,
      read: receivedMessage.read,
      messageid: receivedMessage.messageId,
    },
    receivedMessage.msgid
  );

  receivedMessage.participants.forEach(async (p: string) => {
    if (connections[p.toString()]) {
      const clientig = connections[p.toString()];
      clientig.send(JSON.stringify(receivedMessage));
    }

    // connections[p.toString()].send(JSON.stringify(receivedMessage));
  });
  // connections["Arjun"]
};
