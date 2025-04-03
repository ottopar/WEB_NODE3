import { authUser, getMe } from "../controllers/auth-controller.js";
import { postUser } from "../controllers/user-controller.js";
import express from "express";
import { authenticateToken } from "../../middlewares.js";

const authRouter = express.Router();

authRouter.route("/login").post(authUser);
authRouter.route("/register").post(postUser);
authRouter.route("/me").get(authenticateToken, getMe);
authRouter.route("/logout").get(authenticateToken, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default authRouter;
