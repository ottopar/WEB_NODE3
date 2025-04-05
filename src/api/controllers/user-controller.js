import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
  getUserCats,
} from "../models/user-model.js";

import bcrypt from "bcrypt";

const getUser = async (req, res, next) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getUserCatsById = async (req, res, next) => {
  try {
    const cats = await getUserCats(req.params.id);
    res.json(cats);
  } catch (err) {
    next(err);
  }
};

const postUser = async (req, res, next) => {
  try {
    const password = req.body.password || req.body.passwd;

    if (!req.body.username || !password || !req.body.email || !req.body.name) {
      const err = new Error("Missing required fields");
      err.status = 400;
      return next(err);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };

    const result = await addUser(userData);
    res.status(201).json({
      message: "User created successfully",
      user_id: result.user_id,
    });
  } catch (err) {
    next(err);
  }
};

const putUser = async (req, res, next) => {
  try {
    const result = await modifyUser(req.body, req.params.id, res.locals.user);
    if (!result) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await removeUser(req.params.id, res.locals.user);
    if (!result) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export { getUser, getUserById, postUser, putUser, deleteUser, getUserCatsById };
