// create createThumbnail function, use sharp, use after file upload
// save thumbnail image in uploads with suffix _thumb
// use promise version of sharp

import sharp from "sharp";
import jwt from "jsonwebtoken";
import "dotenv/config";
import promisePool from "./utils/database.js";

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

export { createThumbnail, authenticateToken, checkOwnership };
