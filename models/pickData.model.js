const { ObjectId } = require("bson");

module.exports = mongoose => {
    const PickData = mongoose.model(
      "pickData",
      mongoose.Schema(
        {
          userId: ObjectId,
          DDId: ObjectId,
          dataName: String,
          perspective: Array,
          purpose: Array
        },
        { timestamps: true }
      )
    );
  
    return PickData;
};