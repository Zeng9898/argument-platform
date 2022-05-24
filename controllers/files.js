const mongoose = require('mongoose');
const { saveFileInfo, saveContent } = require('../utils/files');
const File = require("../models/file.model")

const uploadFile = async (req, res) => {
    try {
        console.log(req.body);
        const session = await mongoose.startSession();
        session.startTransaction();
        const { userId, fileName, collector, sourceTarget,
            headCounts, collectDate, collectMethod, context } = req.body;
        if (!userId || !fileName || !collector || !sourceTarget || !headCounts
            || !collectDate || !collectMethod || !context || !req.files) {
            return res.status(400).json({
                status: false,
                message: 'Please provide all the details'
            })
        }
        console.log("1");
        let results = []
        await saveFileInfo(
            {
                userId, fileName, collector, sourceTarget,
                headCounts, collectDate, collectMethod, context, session
            }).then(result => {
                results.push(result)
            }).catch(result => {
                results.push(result)
            })
        await saveContent({ file: req.files.file, fileName, session })
            .then(result => {
                results.push(result)
            }).catch(result => {
                results.push(result)
            })

        const failedResult = results.filter((result) => result.status !== true);
        if (failedResult.length) {
            const errors = failedResult.map(a => a.message);
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                status: false,
                message: errors
            })
        }

        await session.commitTransaction();
        session.endSession();
        console.log("6");
        return res.status(201).send(results);
        // ]).then(outcome => {
        //     return res.status(201).send(outcome);
        // }).catch(reason => {
        //     return res.status(400).send(reason)
        // });

        //console.log("result",result);
        //console.log("100")
        // const failure = result.filter((result) => result.status !== true);
        // if (failure.length) {
        //     const errors = failure.map(a => a.message);
        //     return res.status(400).json({
        //         status: false,
        //         message: errors
        //     })
        // }
    } catch (err) {
        console.log("err", err)
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            status: false,
            message: `Unable to perform create file. Please try again. \n Error: ${err}`
        })
    }

}

const allFileInfo = async (req, res) => {
    const userId = req.params.userId;
    await File.find({ userId: mongoose.Types.ObjectId(userId) })
        .then(files => {
            return res.status(201).send(files);
        })
        .catch(err => {
            console.log("err", err);
            return res.status(500).send({
                message: `Unable to find all files. Please try again. \n Error: ${err}`
            })
        })
}
module.exports = { uploadFile, allFileInfo }