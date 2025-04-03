import { listAllUsers, findUserById, addUser } from "../models/user-model.js";

const getUser = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = (req, res) => {
  const result = addUser(req.body);
  if (result.error) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(201).json({
    message: "New user added.",
    user_id: result.user_id,
  });
};

const putUser = (req, res) => {
  res.json({ message: "User item updated" });
};

const deleteUser = (req, res) => {
  res.json({ message: "User item deleted" });
};

export { getUser, getUserById, postUser, putUser, deleteUser };
