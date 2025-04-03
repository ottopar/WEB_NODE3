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

const modifyUser = async (user, id, currentUser) => {
  let sql;
  let params;

  if (currentUser.role === "admin") {
    sql = "UPDATE wsk_users SET ? WHERE user_id = ?";
    params = [user, id];
  } else {
    sql = "UPDATE wsk_users SET ? WHERE user_id = ? AND user_id = ?";
    params = [user, id, currentUser.user_id];
  }

  const [rows] = await promisePool.execute(promisePool.format(sql, params));
  return rows.affectedRows > 0;
};

const removeUser = async (id, currentUser) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    let success = false;
    if (currentUser.role === "admin") {
      // Admin can delete any user
      await connection.execute("DELETE FROM wsk_cats WHERE owner = ?", [id]);
      const [rows] = await connection.execute(
        "DELETE FROM wsk_users WHERE user_id = ?",
        [id]
      );
      success = rows.affectedRows > 0;
    } else {
      // Regular users can only delete themselves
      if (currentUser.user_id === parseInt(id)) {
        await connection.execute("DELETE FROM wsk_cats WHERE owner = ?", [id]);
        const [rows] = await connection.execute(
          "DELETE FROM wsk_users WHERE user_id = ?",
          [id]
        );
        success = rows.affectedRows > 0;
      }
    }

    await connection.commit();
    return success;
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

const login = async (user) => {
  const sql = `SELECT * FROM wsk_users WHERE username = ?`;

  const [rows] = await promisePool.execute(sql, [user]);
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

export {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
  getUserCats,
  login,
};
