import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { login } from "../models/user-model.js";

const authUser = async (req, res, next) => {
  try {
    const result = await login(req.body.username);

    const passwordValid = bcrypt.compareSync(
      req.body.password,
      result.password
    );

    if (!passwordValid) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      return next(error);
    }

    const userForToken = {
      user_id: result.user_id,
      name: result.name,
      username: result.username,
      email: result.email,
      role: result.role || "user", // Ensure role is always set
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ user: userForToken, token });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  console.log("getMe", res.locals.user);
  if (res.locals.user) {
    res.json({ message: "token ok", user: res.locals.user });
  } else {
    const error = new Error("Unauthorized");
    error.status = 401;
    next(error);
  }
};

export { authUser, getMe };
