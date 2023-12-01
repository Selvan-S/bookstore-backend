import mongoose from "mongoose";
let Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
const reviewSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    book_id: {
      type: ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Reviews = mongoose.model("Reviews", reviewSchema);
