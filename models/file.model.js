// 載入 Mongoose 並載入 mongoose.Schema 功能
const { ObjectId } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 使用 new Schema() 宣告資料
const File = new Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  collector: {
    type: String,
    required: true
  },
  sourceTarget: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  headCounts: {
    type: Number,
    required: true
  },
  collectDate: {
    type: Date,
    required: true
  },
  collectMethod: {
    type: String,
    required: true
  },
  context: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now  // 取得當下時間戳記
  }
})

module.exports = mongoose.model('File', File)