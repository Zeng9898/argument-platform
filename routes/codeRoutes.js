const express = require("express")
const router = express.Router()
const CodeSys = require("../models/codeSys.model")
const EncodeTask = require("../models/encodeTask.model")
const DiscussData = require("../models/discussData.model")
const mongoose = require('mongoose');

const controller = require("../controllers/controller")

router.post('/codeSystem', (req, res) => {
    const { userId, codeName, purpose, code, source } = req.body;
    const newCodeSys = new CodeSys({
        userId: userId,
        codeName: codeName,
        purpose: purpose,
        code: code,
        source: source
    });
    newCodeSys.save()
        .then((value) => {
            console.log(value)
            res.send({ success: "create code system successfully" })
            //File.findById()
        }).catch(value => {
            console.log(value)
            res.send({ error: value })
        });
})

router.post('/encodeTask', (req, res) => {
    const { userId, codeSysId, fileId, startTime, endTime, status, creator } = req.body;
    const coCode = Math.floor(Math.random() * 100000);
    const newEncodeTask = new EncodeTask({
        userId: userId,
        codeSysId: codeSysId,
        fileId: fileId,
        startTime: startTime,
        endTime: endTime,
        status: status,
        coCode: coCode,
        creator: creator
    });
    newEncodeTask.save()
        .then((value) => {
            console.log(value)
            res.send({ success: "create encode task successfully" })
            //File.findById()
        }).catch(value => {
            console.log(value)
            res.send({ error: value })
        });
})

router.post('/tag', (req, res) => {
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

})

router.get('/allEncodeTask/:userId', async (req, res) => {
    const userId = req.params.userId
    const EncodeTaskInfo = await EncodeTask.aggregate([
        {
            $match:
            {
                "userId": mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:
            {
                from: 'files',
                localField: 'fileId',
                foreignField: '_id',
                as: 'fileDetails'
            }
        },
        {
            $lookup:
            {
                from: 'codesys',
                localField: 'codeSysId',
                foreignField: '_id',
                as: 'codeSysDetails'
            }
        }
    ]);
    res.send(EncodeTaskInfo)
});

router.get('/codeSystem/:userId', async (req, res) => {
    const userId = req.params.userId
    CodeSys.find({ userId: userId }).then(
        code => {
            console.log(code);
            res.send(code);
        }
    ).catch(
        err => {
            res.status(500).send({
                CodeSys: err || "Some error occur while retrieving codesys."
            })
        }
    )

});

module.exports = router;