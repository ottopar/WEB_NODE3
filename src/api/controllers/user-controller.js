import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
  getUserCats,
} from "../models/user-model.js";

import bcrypt from "bcrypt";

const getUser = async (req, res) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserCatsById = async (req, res) => {
  try {
    const cats = await getUserCats(req.params.id);
    res.json(cats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postUser = async (req, res) => {
  console.log("Registration attempt:", {
    ...req.body,
    password: "***hidden***",
  });

  try {
    // Handle both password and passwd fields
    const password = req.body.password || req.body.passwd;

    if (!req.body.username || !password || !req.body.email || !req.body.name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Hash the password
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
  } catch (error) {
    console.error("Registration error details:", error);
    res.status(500).json({ error: error.message });
  }
};

const putUser = async (req, res) => {
  try {
    const result = await modifyUser(req.body, req.params.id, res.locals.user);
    if (result) {
      res.json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await removeUser(req.params.id, res.locals.user);
    if (result) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getUser, getUserById, postUser, putUser, deleteUser, getUserCatsById };
