import promisePool from "../../utils/database.js";

const listAllCats = async () => {
  const [rows] = await promisePool.query(`
    SELECT c.*, u.name as owner_name 
    FROM wsk_cats c 
    LEFT JOIN wsk_users u ON c.owner = u.user_id
  `);
  console.log("rows", rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    `SELECT c.*, u.name as owner_name 
     FROM wsk_cats c 
     LEFT JOIN wsk_users u ON c.owner = u.user_id 
     WHERE c.cat_id = ?`,
    [id]
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addCat = async (cat) => {
  const { cat_name, weight, owner, filename, birthdate } = cat;
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  const rows = await promisePool.execute(sql, params);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { cat_id: rows[0].insertId };
};

const modifyCat = async (cat, id, user) => {
  let sql;
  let params;

  if (user.role === "admin") {
    sql = "UPDATE wsk_cats SET ? WHERE cat_id = ?";
    params = [cat, id];
  } else {
    sql = "UPDATE wsk_cats SET ? WHERE cat_id = ? AND owner = ?";
    params = [cat, id, user.user_id];
  }

  const [rows] = await promisePool.execute(promisePool.format(sql, params));
  return rows.affectedRows > 0;
};

const removeCat = async (id, user) => {
  let sql;
  let params;

  if (user.role === "admin") {
    sql = "DELETE FROM wsk_cats WHERE cat_id = ?";
    params = [id];
  } else {
    sql = "DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?";
    params = [id, user.user_id];
  }

  const [rows] = await promisePool.execute(sql, params);
  return rows.affectedRows > 0;
};

export { listAllCats, findCatById, addCat, modifyCat, removeCat };
