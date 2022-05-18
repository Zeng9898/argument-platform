// 載入 Mongoose 並載入 mongoose.Schema 功能
const mongoose = require('mongoose')
const { ObjectId } = require('bson')
const Schema = mongoose.Schema
// 使用 new Schema() 宣告資料
const CodeSys = new Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  codeName: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  code: {
    type: Array,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  favorite: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now  // 取得當下時間戳記
  }
})
module.exports = mongoose.model('CodeSys', CodeSys)