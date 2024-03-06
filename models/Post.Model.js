const mongoose = require("mongoose");

const { Schema } = mongoose;
const Post = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must belong to user"],
    },

    desc: {
      type:String,
      // required: [true, "describe must be exist"],
    
    },
    slug : {
      type: String,
      lowercase: true,
    },
    likes: [],
    image: String,
    video: String,

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
Post.virtual("comment", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

Post.pre(/^find/, function (next) {
  this.populate( {  path: "user",select: "-password"});
  next();
});  




const setImageURL = (doc) => {

  if (doc.video) {
    // const vidoList = [];
    // doc.video.forEach((vid) => {
      const imgUrl = `${process.env.BASE_URL}/posts/${doc.video}`;
      // vidoList.push(imgUrl);
    // });

    doc.video = imgUrl;
  }
  
  if (doc.image) {

    // const imgList = [];
    // doc.image.forEach((img) => {
      const imgUrl = `${process.env.BASE_URL}/posts/${doc.image}`;
    //   imgList.push(imgUrl);
    // });

    doc.image = imgUrl;
  }
};



Post.post("init", (doc) => {
  setImageURL(doc);
});

// create
Post.post("save", (doc) => {
  setImageURL(doc);
});





module.exports = mongoose.model("Post", Post);
