import express from "express";
import {
  upload,
  createThumbnail,
  authenticateToken,
  checkOwnership,
  validationErrors,
} from "../../middlewares.js";

import { body } from "express-validator";

import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from "../controllers/cat-controller.js";

const catRouter = express.Router();

catRouter
  .route("/")
  .get(getCat)
  .post(
    authenticateToken,
    upload.single("file"),
    [
      body("cat_name")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be between 3-50 characters"),
      body("weight")
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Weight must be a positive number"),
      body("owner").notEmpty().isInt().withMessage("Owner must be an integer"),
      body("birthdate")
        .notEmpty()
        .isISO8601()
        .withMessage("Birthdate must be a valid date"),
    ],
    (req, res, next) => {
      if (!req.file) {
        const error = new Error("File is required");
        error.status = 400;
        return next(error);
      }
      next();
    },
    validationErrors,
    createThumbnail,
    postCat
  );

catRouter
  .route("/:id")
  .get(getCatById)
  .put(
    authenticateToken,
    checkOwnership("cat"),
    [
      body("name").trim().optional().notEmpty().withMessage("Name is required"),
      body("birthdate")
        .optional()
        .isISO8601()
        .withMessage("Birthdate must be a valid date"),
      body("weight")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Weight must be a positive number"),
    ],
    validationErrors,
    putCat
  )
  .delete(authenticateToken, checkOwnership("cat"), deleteCat);

export default catRouter;
