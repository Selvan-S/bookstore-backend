import express from "express";
import { Book } from "../models/bookModel.js";
import mongoose from "mongoose";

const router = express.Router();

// Route for Save a New Book
router.post("/", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.userId ||
      !request.body.userName ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
      about: request.body.about,
      userId: request.body.userId,
      userName: request.body.userName,
    };
    const book = await Book.create(newBook);
    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Books from database

// router.get("/", async (request, response) => {
//   try {
//     const books = await Book.find();
//     return response.status(200).json({
//       count: books.length,
//       data: books,
//     });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// Route for search Book from database
router.get("/", async (request, response) => {
  try {
    const booksPerPage = request.query.booksPerPage
      ? parseInt(request.query.booksPerPage, 10)
      : 10;
    const page = request.query.page ? parseInt(request.query.page, 10) : 0;
    let filters = {};
    if (request.query.title) {
      filters.title = request.query.title;
    } else if (request.query.author) {
      filters.author = request.query.author;
    } else if (request.query.publishYear) {
      filters.publishYear = request.query.publishYear;
    }

    let query;
    if (filters) {
      if ("title" in filters) {
        query = { $text: { $search: filters["title"] } };
      } else if ("author" in filters) {
        query = { author: { $eq: filters["author"] } };
      } else if ("publishYear" in filters) {
        query = {
          publishYear: { $eq: filters["publishYear"] },
        };
      }
    }

    let cursor;
    try {
      cursor = await Book.find(query);
    } catch (e) {
      response
        .status(500)
        .send({ message: `Unable to issue find command, ${e.message} ` });
    }
    let bookList;
    let totalNumBooks;
    try {
      bookList = await await Book.find(query)
        .limit(booksPerPage)
        .skip(booksPerPage * page)
        .exec();
      totalNumBooks = await Book.countDocuments(query);
    } catch (e) {
      response.status(500).send({
        message: `Unable to convert cursor to array or problem counting documents, ${e.message} `,
      });
    }

    return response.status(200).json({
      books: bookList,
      page: page,
      filters: filters,
      entries_per_page: booksPerPage,
      total_results: totalNumBooks,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: `error message ${error.message} ` });
  }
});

// Route for Get One Book from database by ID
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const book = await Book.findById(id);
    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update a Book

router.put("/:id", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.userId ||
      !request.body.userName ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const UpdateBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
      about: request.body.about,
      userId: request.body.userId,
      userName: request.body.userName,
    };
    const { id } = request.params;
    const result = await Book.findByIdAndUpdate(id, UpdateBook);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }
    return response.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a book

router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      response.status(404).json({ message: "Book not found" });
    }

    return response
      .status(200)
      .json({ message: "Book is deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Book from database by ID
router.get("/id/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const aggregate = await Book.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "reviews",
          let: {
            id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$book_id", "$$id"],
                },
              },
            },
            {
              $sort: {
                updatedAt: -1,
              },
            },
          ],
          as: "reviews",
        },
      },
      {
        $addFields: {
          reviews: "$reviews",
        },
      },
    ]);

    if (!aggregate) {
      return response.status(404).json({ message: "Book not found" });
    }
    return response.status(200).json(aggregate);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
