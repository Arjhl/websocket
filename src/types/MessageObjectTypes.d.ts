import { ObjectId } from "mongodb";

export type msgType = {
  sender: string;
  sender_id: ObjectId;
  participants: ObjectId[];
  message: string;
  timeStamp: Date;
  messageid: string;
  read: boolean;
};

export type MsgObject = {
  participants: ObjectId[];
  messageList: msgType[];
};

export type WsMessageType = {
  message_id: string;
  sender: string;
  sender_id: ObjectId;
  participants: ObjectId[];
  message: string;
  timeStamp: Date;
  msgid: ObjectId;
};
