import { authUser, getMe } from "../controllers/auth-controller.js";
import { postUser } from "../controllers/user-controller.js";
import express from "express";
import { authenticateToken, validationErrors } from "../../middlewares.js";
import { body } from "express-validator";

const authRouter = express.Router();

authRouter
  .route("/login")
  .post(
    [
      body("username").trim().notEmpty().withMessage("Username is required"),
      body("password").trim().notEmpty().withMessage("Password is required"),
    ],
    validationErrors,
    authUser
  );
authRouter.route("/register").post(
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
authRouter.route("/me").get(authenticateToken, getMe);
authRouter.route("/logout").get(authenticateToken, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default authRouter;
