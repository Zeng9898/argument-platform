const mongoose = require("mongoose")
const { ObjectId } = require("bson");
const Schema = mongoose.Schema

const History = new Schema({
  userId: {
    type: String,
    default: "",
  },
  perspective: {
    type: Array,
    default: "",
  },
  purpose: {
    type: Array,
    default: "",
  },
  version: {
    type: Array,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

const DiscussData = new Schema({
  FNId: {
    type: String,
    default: "",
  },
  dataName: {
    type: String,
    default: "",
  },
  history: {
    type: [History],
  },
})

module.exports = mongoose.model("DiscussData", DiscussData)