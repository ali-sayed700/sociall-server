const mongoose = require("mongoose");

const { Schema } = mongoose;

const Block = new Schema( { 
  
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  blockedUser:[
{
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  blocked :{
    type:Boolean,
    default:false
  }

}
  ]

},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Block", Block);
