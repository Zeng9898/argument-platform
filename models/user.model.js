// 載入 Mongoose 並載入 mongoose.Schema 功能
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 使用 new Schema() 宣告資料
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now  // 取得當下時間戳記
  }
})
module.exports = mongoose.model('User', UserSchema)