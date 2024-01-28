import { ObjectId } from "mongodb";
import mongoose from "mongoose";

//contact array = [{name , lastmessage  , msgObject_id , timestamp}]

const contactSchema = new mongoose.Schema({
  user_id: {
    type: ObjectId,
    required: true,
  },
  contactList: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Contact", contactSchema);
