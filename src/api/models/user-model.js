import promisePool from "../../utils/database.js";

const listAllUsers = async () => {
  const [rows] = await promisePool.query("SELECT * FROM wsk_users");
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM wsk_users WHERE user_id = ?",
    [id]
  );
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user) => {
  const { name, username, email, password } = user;
  const sql = `INSERT INTO wsk_users (name, username, email, password, role) 
               VALUES (?, ?, ?, ?, ?)`;
  const params = [name, username, email, password, user.role || "user"];
  const [rows] = await promisePool.execute(sql, params);
  if (rows.affectedRows === 0) {
    return false;
  }
  return { user_id: rows.insertId };
};

const modifyUser = async (user, id) => {
  const sql = promisePool.format(`UPDATE wsk_users SET ? WHERE user_id = ?`, [
    user,
    id,
  ]);
  const [rows] = await promisePool.execute(sql);
  if (rows.affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete user's cats first
    await connection.execute("DELETE FROM wsk_cats WHERE owner = ?", [id]);

    // Then delete the user
    const [rows] = await connection.execute(
      "DELETE FROM wsk_users WHERE user_id = ?",
      [id]
    );

    await connection.commit();

    if (rows.affectedRows === 0) {
      return false;
    }
    return { message: "success" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getUserCats = async (userId) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM wsk_cats WHERE owner = ?",
    [userId]
  );
  return rows;
};

export {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
  getUserCats,
};
