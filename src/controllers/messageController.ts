import { Request, Response } from "express";
import { msgType } from "../types/MessageObjectTypes";
import { ObjectId } from "mongodb";
const Contact = require("../model/Contacts");
const Message = require("../model/Messages");

export async function getMessgaes(req: Request, res: Response) {
  const messageId = req.query.messageId;

  try {
    const response = await Message.findOne({ _id: messageId }).exec();
    console.log("Response of getMessages", response);
    res.send(response);
  } catch (err) {
    res.send(err);
  }
}

export async function putMessages(msg: msgType, msgid: ObjectId) {
  try {
    const msgObj = await Message.findOne({ _id: msgid }).exec();
    const [p1, p2] = msgObj.participants;
    console.log(p1, p2);

    await Contact.findOneAndUpdate(
      {
        user_id: p1,
        "contactList.recieverId": p2,
      },
      {
        $set: {
          "contactList.$.lastMessage": msg.message,
          "contactList.$.timeStamp": msg.timeStamp,
        },
      },
      { new: true }
    ).exec();

    await Contact.findOneAndUpdate(
      {
        user_id: p2,
        "contactList.recieverId": p1,
      },
      {
        $set: {
          "contactList.$.lastMessage": msg.message,
          "contactList.$.timeStamp": msg.timeStamp,
        },
      },
      { new: true }
    ).exec();

    await msgObj.messagelist.push(msg);
    msgObj.save();

    console.log("Message saved");
  } catch (err) {
    return err;
  }
}

export async function updateMessage(wsMsg: any, connections: any) {
  // const msgid = req.body.messageId;
  // console.log("req msgid", req.body);
  // const msgObjId = req.body.msgid;

  const msgid = wsMsg.messageId;
  const msgObjId = wsMsg.msgid;
  const receiver_id = connections[wsMsg.receiver_id.toString()];
  const sender_id = connections[wsMsg.sender_id.toString()];

  // get receiver id and the emit connections[receiverid].send(update)
  try {
    const updatedMessages = await Message.findOneAndUpdate(
      {
        _id: msgObjId,
        "messagelist.messageid": msgid,
      },
      { $set: { "messagelist.$.read": true } },
      { new: true }
    ).exec();

    if (receiver_id) {
      receiver_id.send(JSON.stringify(updatedMessages));
    }
    if (sender_id) {
      sender_id.send(JSON.stringify(updatedMessages));
    }

    // msgObj.messagelist.forEach(async (e: any, i: any) => {
    //   if (e.messageid === msgid) {

    // console.log(e, msgObj.messagelist[i]);
    // msgObj.messagelist[i].read = true;
    // await msgObj.save();
    // const newArr = msgObj.messagelist[i];
    // newArr.read = true;
    // const filtered = msgObj.messagelist.filter(
    //   (m: any) => m.messageid !== msgid
    // );
    // const update = { messagelist: [...filtered, newArr].sort() };
    // connections[receiver_id]?.send(
    //   JSON.stringify({ update: update, status: true })
    // );
    // await Message.findOneAndUpdate({ _id: msgObjId }, update);
    // }
    // });
  } catch (err) {
    console.log(err);
  }
}
