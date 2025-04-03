import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { login } from "../models/user-model.js";

const authUser = async (req, res) => {
  try {
    const result = await login(req.body.username);

    const passwordValid = bcrypt.compareSync(
      req.body.password,
      result.password
    );

    if (!passwordValid) {
      return res.sendStatus(401);
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
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  console.log("getMe", res.locals.user);
  if (res.locals.user) {
    res.json({ message: "token ok", user: res.locals.user });
  } else {
    res.sendStatus(401);
  }
};

export { authUser, getMe };
