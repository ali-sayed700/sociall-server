const mongoose = require("mongoose");

const { Schema } = mongoose;

const Message = new Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
    video:[{ type: String }],
    image: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const setImageURL = (doc) => {
  if (doc.video) {
   
    const vidoList = [];
    doc.video.forEach((vid) => {
      const imgUrl = `${process.env.BASE_URL}/messages/${vid}`;
      vidoList.push(imgUrl);
    });

    doc.video = vidoList;
  }
  
  if (doc.image) {

    const imgList = [];
    doc.image.forEach((img) => {
      const imgUrl = `${process.env.BASE_URL}/messages/${img}`;
      imgList.push(imgUrl);
    });

    doc.image = imgList;
  }
};
// findOne, findAll and update
Message.post("init", (doc) => {
  setImageURL(doc);
});

// create
Message.post("save", (doc) => {
  setImageURL(doc);
});



module.exports = mongoose.model("Message", Message);
