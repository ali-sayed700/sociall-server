// # mongoose
const mongoose = require("mongoose");
// # Schema
const { Schema } = mongoose;
// const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };
// # creating schema
const CommentSchema = new Schema(
  {
    comment: { type: String },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "comment must be belong to user"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "post must be belong to comment"],
    },
  },
  {
    timestamps: true,

    // ...opts,
  }
);

CommentSchema.pre(/^find/, function (next) {
  this.populate({ path: "user" });

  next();
});

module.exports = mongoose.model("Comment", CommentSchema);
