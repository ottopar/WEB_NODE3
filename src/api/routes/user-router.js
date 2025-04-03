import express from "express";
import { authenticateToken, checkOwnership } from "../../middlewares.js";

import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
  getUserCatsById,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.route("/").get(authenticateToken, getUser).post(postUser);

userRouter
  .route("/:id")
  .get(authenticateToken, checkOwnership("user"), getUserById)
  .put(authenticateToken, checkOwnership("user"), putUser)
  .delete(authenticateToken, checkOwnership("user"), deleteUser);

userRouter
  .route("/:id/cats")
  .get(authenticateToken, checkOwnership("user"), getUserCatsById);

export default userRouter;
