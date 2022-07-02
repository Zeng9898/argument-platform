const DiscussData = require("../models/discussData.model")
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const datas = require("../controllers/data")

//將資料標註為不重要
router.post('/pointless', datas.tagPointless)
//取消將資料標註為不重要
router.delete('/pointless', datas.unTagPointless)

router.get('/userData', async (req, res) => {
  const userId = req.query.userId;
  const fileId = req.query.fileId;
  const encodeTaskId = req.query.encodeTaskId
  DiscussData.find({ fileId: fileId }).then(
    data => {
      data.forEach(item => {
        item.history = item.history.filter(record => record.userId == userId && record.encodeTaskId == encodeTaskId);
      })
      res.send(data);
    }
  )
})

router.get('/adjustData/:encodeTaskId/:fileId', async (req, res) => {
  const encodeTaskId = req.params.encodeTaskId;
  const fileId = req.params.fileId;
  const discussData = await DiscussData.aggregate([
    {
      $match:
      {
        //'history.'
        "fileId": mongoose.Types.ObjectId(fileId)
        //$or: [{ "userId": mongoose.Types.ObjectId(userId) }, { "coCoder": mongoose.Types.ObjectId(userId) }]
      }
    },
    {
      "$unwind":
      {
        "path": "$history",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      $match:
      {
        //'history.'
        "history.encodeTaskId": mongoose.Types.ObjectId(encodeTaskId)
        //$or: [{ "userId": mongoose.Types.ObjectId(userId) }, { "coCoder": mongoose.Types.ObjectId(userId) }]
      }
    },
    {
      $lookup:
      {
        from: 'users',
        localField: 'history.userId',
        foreignField: '_id',
        as: 'userDetails'
      }
    }
    // {
    //   $lookup:
    //   {
    //     from: 'codesys',
    //     localField: 'codeSysId',
    //     foreignField: '_id',
    //     as: 'codeSysDetails'
    //   }
    // }
  ]);
  res.send(discussData)
  // DiscussData.find({ fileId: fileId }).then(
  //   data => {
  //     data.forEach(item => {
  //       item.history = item.history.filter(record => record.encodeTaskId == encodeTaskId);
  //     })
  //     res.send(data);
  //   }
  // )
})


module.exports = router
