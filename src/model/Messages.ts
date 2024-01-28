import mongoose from "mongoose";
// const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  participants: {
    type: Array,
    required: true,
  },
  messagelist: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
