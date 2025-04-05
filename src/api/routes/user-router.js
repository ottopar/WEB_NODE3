import express from "express";
import {
  authenticateToken,
  checkOwnership,
  validationErrors,
} from "../../middlewares.js";
import { body } from "express-validator";

import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
  getUserCatsById,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(authenticateToken, getUser)
  .post(
    [
      body("username")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Username can only contain letters and numbers"),
      body("email").trim().isEmail().withMessage("Valid email is required"),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/\d/)
        .withMessage("Password must contain at least one number")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter"),
      body("name").trim().notEmpty().withMessage("Name is required"),
    ],
    validationErrors,
    postUser
  );

userRouter
  .route("/:id")
  .get(authenticateToken, checkOwnership("user"), getUserById)
  .put(
    authenticateToken,
    checkOwnership("user"),
    [
      body("username")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Username can only contain letters and numbers"),
      body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Valid email is required"),
      body("name").optional().trim().notEmpty().withMessage("Name is required"),
    ],
    validationErrors,
    putUser
  )
  .delete(authenticateToken, checkOwnership("user"), deleteUser);

userRouter
  .route("/:id/cats")
  .get(authenticateToken, checkOwnership("user"), getUserCatsById);

export default userRouter;
