import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishYear: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model("Books", bookSchema);
