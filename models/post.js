const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    content: {
      type: String,
      required: [true, "Content is required."],
    },
    imageUrl: String,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: [true, "Creator is required."],
    },
  },
  {
    timestamps: true,
    //   toJSON: {
    //     transform: (doc, ret) => {
    //       ret.id = doc._id;
    //       delete ret._id;
    //       delete ret.__v;
    //       return ret;
    //     },
    //   },
  }
);

module.exports = mongoose.model("Post", postSchema);
