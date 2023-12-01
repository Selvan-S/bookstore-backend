import mongoose from "mongoose";
import { Reviews } from "../models/reviewsModel.js";
import express from "express";
const router = express.Router();

// Route for Post Review
router.post("/", async (request, response) => {
  try {
    const newReview = {
      name: request.body.name,
      user_id: request.body.user_id,
      text: request.body.text,
      book_id: request.body.book_id,
    };
    const ReviewResponse = await Reviews.create(newReview);
    return response.status(201).send(ReviewResponse);
  } catch (e) {
    console.error(`Unable to post review: ${e}`);
    response.status(500).send({ message: e.message });
  }
});

// Route for Get All Reviews from database

router.get("/", async (request, response) => {
  try {
    const reviews = await Reviews.find();
    return response.status(200).json({
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
// Route for Get one Review from database

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const user_id = request.body.user_id;
    const reviews = await Reviews.findById({
      _id: request.params.id,
    });
    return response.status(200).json({
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for update Review

router.put("/", async (request, response) => {
  try {
    const updateResponse = await Reviews.findOneAndUpdate(
      {
        user_id: request.body.user_id,
        _id: new mongoose.Types.ObjectId(request.body.review_id),
      },
      {
        $set: { text: request.body.text },
      }
    );

    if (!updateResponse) {
      return response.status(404).json({ message: "Review not found" });
    }
    return response
      .status(200)
      .send({ message: "Review updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for delete a review

router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const deleteResponse = await Reviews.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      user_id: request.body.user_id,
    });
    if (!deleteResponse) {
      return response.status(404).json({ message: "Review not found" });
    }

    return response
      .status(200)
      .json({ message: "Review is deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
export default router;
