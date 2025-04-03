import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
  getUserCats,
} from "../models/user-model.js";

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
  try {
    const result = await addUser(req.body);
    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.status(201).json({
      message: "New user added.",
      user_id: result.user_id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const putUser = async (req, res) => {
  try {
    const result = await modifyUser(req.body, req.params.id);
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
    const result = await removeUser(req.params.id);
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
