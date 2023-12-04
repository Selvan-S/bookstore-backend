import express, { request, response } from "express";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import { Book } from "./models/bookModel.js";
import dotenv from "dotenv";
import cors from "cors"
import booksRoute from "./routes/booksRoute.js";
import { Reviews } from "./models/reviewsModel.js";
import reviewRoute from "./routes/reviewRoute.js";
dotenv.config();

const port = process.env.PORT;
const app = express();

// Middleware for parsing request body
app.use(express.json());

connectDB();

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
app.use(cors({ origin: "*" }));
// Option 2: Allow Custom Origins
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use("/books", booksRoute);
app.use("/review", reviewRoute);
