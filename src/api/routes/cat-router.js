import express from "express";
import multer from "multer";
import { createThumbnail } from "../../middlewares.js";

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
  .post(upload.single("file"), createThumbnail, postCat);

catRouter.route("/:id").get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
