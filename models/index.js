const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.uri = dbConfig.uri;
db.pickDatas = require("./pickData.model.js")(mongoose);

module.exports = db;