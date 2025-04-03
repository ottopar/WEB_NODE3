const userItems = [
  {
    user_id: 3609,
    name: "John Doe",
    username: "johndoe",
    email: "john@metropolia.fi",
    role: "user",
    password: "password",
  },
  {
    user_id: 9843,
    name: "Heikki",
    username: "heikki",
    email: "heikki@metropolia.fi",
    role: "user",
    password: "salasana",
  },
];

const listAllUsers = () => {
  return userItems;
};

const findUserById = (id) => {
  return userItems.find((item) => item.user_id == id);
};

const addUser = (user) => {
  if (!user.name || !user.username || !user.email || !user.password) {
    return { error: "Missing required fields" };
  }
  const newId = Math.max(...userItems.map((item) => item.user_id), 0) + 1;
  const newUser = {
    user_id: newId,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role || "user",
    password: user.password,
  };

  userItems.unshift(newUser);
  return { user_id: newId };
};

export { listAllUsers, findUserById, addUser };
