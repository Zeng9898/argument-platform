const mongoose = require("mongoose")
const { ObjectId } = require("bson");
const Schema = mongoose.Schema

const Files = new Schema({
  fileName: {
    type: String,
    default: "",
  },
  coCode: {
    type: String,
    default: "",
  },
  codeSys: {
    type: Array,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

const UserProfile = new Schema({
  userName: {
    type: String,
    default: "",
  },
  files: {
    type: [Files],
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model("UserProfile", UserProfile)