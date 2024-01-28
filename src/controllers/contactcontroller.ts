import { Request, Response } from "express";
import { ObjectId } from "mongodb";
const Contact = require("../model/Contacts");
const Message = require("../model/Messages");

export async function getContacts(req: Request, res: Response) {
  const userId = req.query.userId;
  console.log(userId);

  try {
    const response = await Contact.findOne({ user_id: userId }).exec();
    //sort and send contact list
    res.send(response);
  } catch (err) {
    res.send(err);
  }
}

export async function addContact(req: Request, res: Response) {
  //new contact and message objec should be created
  console.log("Adding contact");
  const { senderName, receiverName, senderId, receiverId } = req.body;

  try {
    const senderContact = await Contact.findOne({ user_id: senderId }).exec();
    const receiverContact = await Contact.findOne({
      user_id: receiverId,
    }).exec();
    if (!receiverContact) {
      res.status(403).send("Contact not found");
    }

    senderContact.contactList.forEach((contact: any) => {
      if (contact.length === 0) return;
      if (contact.recieverId === receiverId) {
        return res.status(409).send("Contact already exists");
      }
    });

    const newMessageCollection = await Message.create({
      messageList: [],
      participants: [senderId, receiverId],
    });

    senderContact.contactList.push({
      name: receiverName,
      recieverId: receiverId,
      msgObject_id: newMessageCollection._id,
      lastMessage: "",
      timeStamp: Date.now(),
    });
    await senderContact.save();

    receiverContact.contactList.push({
      name: senderName,
      recieverId: senderId,
      msgObject_id: newMessageCollection._id,
      lastMessage: "",
      timeStamp: Date.now(),
    });
    await receiverContact.save();

    return res.send("New contact added successfully");
  } catch (err) {
    res.status(401);
  }
}

export async function createGroup(req: Request, res: Response) {
  const participantsList = req.body.participants;
  const groupName = req.body.groupName;

  if (!groupName) return res.send("Group name is required");

  try {
    const newMessageCollection = await Message.create({
      messageList: [],
      participants: participantsList,
      groupName: groupName,
    });
    participantsList.map(async (p: ObjectId) => {
      const contact = await Contact.findOne({ user_id: p }).exec();

      contact.contacts.push({
        participants: participantsList,
        msgObject_id: newMessageCollection._id,
      });
      await contact.save();
    });
    res.send("New contact added successfully");
  } catch (err) {
    res.status(401);
  }
}

export async function updateGroup(req: Request, res: Response) {
  //find contact and make changes , this is for adding people to the group
  const messageCollectionId = req.params.messageId;
  const newParticipantsList = req.body.participants;

  newParticipantsList.map(async (participant: ObjectId) => {
    const contactTobeMutated = await Contact.findOne({
      user_id: participant,
    }).exec();
    const newContact = contactTobeMutated.contacts.filter(
      (c: any) => c.MsgObject_id !== messageCollectionId
    )[0];
    newContact.participants = newParticipantsList;
    const filteredContacts = contactTobeMutated.contacts.filter(
      (c: any) => c.MsgObject_id !== messageCollectionId
    );

    contactTobeMutated.contacts = [...filteredContacts, newContact];
  });
}
