const controller = require("../controllers/controller.js");
const DiscussData = require("../models/discussData.model")
const express = require("express");
const { disconnect } = require("mongoose");
const router = express.Router();
const url = require('url');
const mongoose = require('mongoose');


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

router.get('/adjustData', async (req, res) => {
  const { encodeTaskId, fileId } = req.body;
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
