const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],

    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    firstname: {
      type: String,
      required: [true, "firstname is required"],
    },
    lastname: {
      type: String,
      required: [true, "lastname is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    profilePicture: String,
    coverPicture: String,
    about: String,
    livesin: String,
    country: String,
    worksAt: String,
    relationship: String,
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        
      },
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

  },
  { timestamps: true }
  );

  
  

const setImageURL = (doc) => {

  if (doc.profilePicture) {

    const imageUrl = `${process.env.BASE_URL}/users/${doc.profilePicture}`;
    doc.profilePicture = imageUrl;
  }

  if (doc.coverPicture) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.coverPicture}`;
    doc.coverPicture = imageUrl;
  }
    
//   if (doc.followingPosts) {
// console.log(doc.followingPosts);
//     const imgList = [];
//     doc.image.forEach((img) => {
//       const imgUrl = `${process.env.BASE_URL}/posts/${img}`;
//       imgList.push(imgUrl);
//       // doc.image = imgList;
//     });

  // }

};
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


// findOne, findAll and update
UserSchema.post("init", (doc) => setImageURL(doc));

// create
UserSchema.post("save", (doc) => setImageURL(doc));
// eslint-disable-next-line prefer-arrow-callback
UserSchema.post('aggregate', function (doc) {
const aggData = doc[0].followingPosts

aggData.forEach((img) => {
if( img.image ) {

  const imgUrl = `${process.env.BASE_URL}/posts/${img.image}`;
  img.image = imgUrl
}

if( img.video ) {
  const videoUrl = `${process.env.BASE_URL}/posts/${img.video}`;
img.video = videoUrl

}

 
      });
});

// module.exports = mongoose.model("User", UserSchema);
const UserModel = mongoose.model("User", UserSchema);


module.exports = UserModel;