const DiscussData = require("../models/discussData.model")
const File = require("../models/file.model")
const xlsx = require('xlsx');
const mongoose = require('mongoose');

const saveFileInfo = async ({ userId, fileName, collector, sourceTarget,
    headCounts, collectDate, collectMethod, context, session }) => {
    console.log("2");
    return new Promise(async (resolve, reject) => {
        const fileExist = await File.findOne({ fileName });
        if (fileExist) {
            reject({
                status: false,
                statusCode: 404,
                message: `File ${fileName} already exist`
            });
            // return {
            //     status: false,
            //     statusCode: 404,
            //     message: `File ${fileName} already exist`
            // }
        }
        else {
            console.log("3")
            console.log(userId, fileName, collector, sourceTarget,
                headCounts, collectDate, collectMethod, context);
            // const newFile = new File({
            //     userId: userId,
            //     fileName: fileName,
            //     collector: collector,
            //     sourceTarget: sourceTarget,
            //     headCounts: headCounts,
            //     collectDate: collectDate,
            //     collectMethod: collectMethod,
            //     context: context
            // });
            // const file = newFile.save({ session: session });
            const file = await File.create([{
                userId: mongoose.Types.ObjectId(userId),
                fileName: fileName,
                collector: collector,
                sourceTarget: sourceTarget,
                headCounts: headCounts,
                collectDate: collectDate,
                collectMethod: collectMethod,
                context: context
            }, { session }]);

            console.log(`Create file info successfully!`)
            resolve({
                status: true,
                statusCode: 201,
                message: 'Create file info successfully!',
                data: { file }
            });
            // return {
            //     status: true,
            //     statusCode: 201,
            //     message: 'Create file info successfully!',
            //     data: { file }
            // }
        }
    });

}

const saveContent = async ({ file, fileName, session }) => {
    console.log("3")
    return new Promise(async (resolve, reject) => {
        const fileExist = await File.findOne({ fileName }).session(session);
        const fileId = fileExist._id;
        file.mv('./uploads/' + fileName, async (err) => { //把檔案移動到/uploads
            console.log("4")
            if (err) {
                reject({
                    status: false,
                    statusCode: 404,
                    message: `fail to move file ${err}`
                })
                return;
            } else {
                const wb = xlsx.readFile("./uploads/" + fileName); //讀取xlsx檔案
                //console.log(wb.SheetNames);
                const ws = wb.Sheets[wb.SheetNames[0]];  //讀取workbook中的其中一個sheet
                //console.log(ws);
                const data = xlsx.utils.sheet_to_json(ws); //用xlsx套件將sheet轉json
                //console.log(wb.Sheets)
                let contentResult = []
                for (let i = 0; i < data.length; i++) {
                    const newData = new DiscussData({ //將每筆json存入discussData表
                        fileId: mongoose.Types.ObjectId(fileId),
                        content: data[i].content,
                        index: data[i].index,
                        time: data[i].time,
                        group: data[i].group,
                        user: data[i].user
                    });
                    console.log("5")
                    await newData.save({ session }); //將每筆資料（一段話）存進discuss data collection
                    contentResult.push({
                        fileId: mongoose.Types.ObjectId(fileId),
                        content: data[i].content,
                        index: data[i].index,
                        time: data[i].time,
                        group: data[i].group,
                        user: data[i].user
                    })
                }
                resolve({
                    status: true,
                    statusCode: 201,
                    message: 'Create content successfully!',
                    data: contentResult
                })
                return;
            }

        })
    })
}

module.exports = {
    saveFileInfo, saveContent
};