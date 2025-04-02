import express from "express";
import catRouter from "./routes/cat-router.js";

const router = express.Router();

// bind base url for all cat routes to catRouter
router.use("/cats", catRouter);
// bind base url for all user routes to userRouter
export default router;
