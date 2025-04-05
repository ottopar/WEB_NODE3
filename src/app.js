import express from "express";
import api from "./api/index.js";
import cors from "cors";
import { notFoundHandler } from "./middlewares.js";
import { errorHandler } from "./middlewares.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/v1", api);

app.use(notFoundHandler);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Welcome to my REST API");
});

export default app;
