import express from "express";
import multer from "multer";
import {
  createThumbnail,
  authenticateToken,
  checkOwnership,
} from "../../middlewares.js";

import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from "../controllers/cat-controller.js";

const catRouter = express.Router();

const upload = multer({ dest: "uploads/" });

catRouter
  .route("/")
  .get(getCat)
  .post(authenticateToken, upload.single("file"), createThumbnail, postCat);

catRouter
  .route("/:id")
  .get(getCatById)
  .put(authenticateToken, checkOwnership("cat"), putCat)
  .delete(authenticateToken, checkOwnership("cat"), deleteCat);

export default catRouter;
