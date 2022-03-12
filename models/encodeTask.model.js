// 載入 Mongoose 並載入 mongoose.Schema 功能
const { ObjectId } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 使用 new Schema() 宣告資料
const EncodeTask = new Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  codeSysId: {
    type: ObjectId,
    required: true
  },
  fileId: {
    type: ObjectId,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  coCode: {
    type: Number,
    required: true
  },
  creator: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now  // 取得當下時間戳記
  }
})

module.exports = mongoose.model('EncodeTask', EncodeTask)