const mongoose = require("mongoose")
const { ObjectId } = require("bson");
const Schema = mongoose.Schema

const History = new Schema({
  userId: {
    type: ObjectId,
    default: "",
  },
  encodeTaskId: {
    type: ObjectId,
    default: "",
  },
  code: {
    type: Array,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

const Result = new Schema({
  encodeTaskId: {
    type: ObjectId,
    default: "",
  },
  code: {
    type: Array,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

const DiscussData = new Schema({
  fileId: {
    type: ObjectId,
    default: "",
  },
  index: {
    type: Number
  },
  user: {
    type: String
  },
  group: {
    type: String
  },
  time: {
    type: Date
  },
  content: {
    type: String,
    default: "",
  },
  history: {
    type: [History],
  },
  result: {
    type: [Result],
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model("DiscussData", DiscussData)