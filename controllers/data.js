const mongoose = require('mongoose');
const DiscussData = require("../models/discussData.model")

const tagData = (req, res) => {
    const { dataId, userId, encodeTaskId, code } = req.body;
    const record = {
        userId: mongoose.Types.ObjectId(userId),
        encodeTaskId: mongoose.Types.ObjectId(encodeTaskId),
        code: code
    }
    DiscussData.findById(mongoose.Types.ObjectId(dataId)).then(
        data => {
            var index = data.history.findIndex(x => x.userId.equals(mongoose.Types.ObjectId(userId))
                && x.encodeTaskId.equals(mongoose.Types.ObjectId(encodeTaskId)))
            if (index != -1) {
                console.log("exist")
                data.fileId = mongoose.Types.ObjectId(data.fileId);
                data.history[index] = record;
                data.history.forEach(item => {
                    item.userId = mongoose.Types.ObjectId(item.userId)
                    item.encodeTaskId = mongoose.Types.ObjectId(item.encodeTaskId)
                })
                data.save().then(
                    result => {
                        res.send(result)
                    }
                ).catch(err => {
                    return res.status(500).send({
                        DiscussData: err || "Some error occur when saving discussdata!"
                    })
                })
            } else {
                console.log("new")
                data.fileId = mongoose.Types.ObjectId(data.fileId)
                data.history.push(record);
                data.history.forEach(item => {
                    item.userId = mongoose.Types.ObjectId(item.userId)
                    item.encodeTaskId = mongoose.Types.ObjectId(item.encodeTaskId)
                })
                data.save().then(
                    data => {
                        res.send(data)
                    }
                ).catch((err) => {
                    return res.status(500).send({
                        data: err || "Some error occurred while tagging data.",
                    });
                })
            }
        }
    ).catch((err) => {
        return res.status(500).send({
            DiscussData: err || "Some error occurred while retrieving DiscussData.",
        });
    })
}

const tagPointless = async (req, res) => {
    const dataId = req.body.dataId;
    await DiscussData.findOneAndUpdate({ _id: dataId }, { pointless: true }).then(result => {
        return res.status(201).send(result);
    }).catch(err => {
        return res.status(501).json({
            message: `err occur when saving the pointless column of discuss data ${err}`
        })
    });
}

const unTagPointless = async (req, res) => {
    const dataId = req.body.dataId;
    await DiscussData.findOneAndUpdate({ _id: dataId }, { pointless: false }).then(result => {
        return res.status(201).send(result);
    }).catch(err => {
        return res.status(501).json({
            message: `err occur when saving the pointless data of discuss data ${err}`
        })
    });
}

module.exports = { tagData, tagPointless, unTagPointless }