// create createThumbnail function, use sharp, use after file upload
// save thumbnail image in uploads with suffix _thumb
// use promise version of sharp

import sharp from "sharp";
import jwt from "jsonwebtoken";
import "dotenv/config";
import promisePool from "./utils/database.js";
import { validationResult } from "express-validator";
import multer from "multer";

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  try {
    const inputPath = req.file.path;
    const outputPath = `${req.file.destination}/${req.file.filename}_thumb.png`;
    await sharp(inputPath).resize(160, 160).toFormat("png").toFile(outputPath);
    next();
  } catch (err) {
    console.error("Error creating thumbnail:", err);
    next(err);
  }
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    const error = new Error("Only images and videos are allowed");
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10 MB
  },
  fileFilter: fileFilter,
});

const authenticateToken = (req, res, next) => {
  console.log("authenticateToken", req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token", token);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send({ message: "invalid token", err });
  }
};

const checkOwnership = (type) => {
  return async (req, res, next) => {
    try {
      const user = res.locals.user;

      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Admin always has access
      if (user.role === "admin") {
        return next();
      }

      if (type === "user") {
        // Convert both to numbers for comparison
        if (parseInt(req.params.id) === parseInt(user.user_id)) {
          return next();
        }
      } else if (type === "cat") {
        const [rows] = await promisePool.execute(
          "SELECT owner FROM wsk_cats WHERE cat_id = ?",
          [req.params.id]
        );
        // Convert both to numbers for comparison
        if (
          rows.length > 0 &&
          parseInt(rows[0].owner) === parseInt(user.user_id)
        ) {
          return next();
        }
      }

      res.status(403).json({ message: "Forbidden - insufficient rights" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
};

const validationErrors = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(", ");
    const error = new Error(messages);
    error.status = 400;
    next(error);
    return;
  }
  next();
};

export {
  upload,
  createThumbnail,
  authenticateToken,
  checkOwnership,
  notFoundHandler,
  errorHandler,
  validationErrors,
};
