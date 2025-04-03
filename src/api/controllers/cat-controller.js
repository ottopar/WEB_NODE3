import {
  addCat,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat,
} from "../models/cat-model.js";

const getCat = async (req, res) => {
  try {
    const cats = await listAllCats();
    res.json(cats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCatById = async (req, res) => {
  try {
    const cat = await findCatById(req.params.id);
    if (cat) {
      res.json(cat);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postCat = async (req, res) => {
  console.log("Form data:", req.body);
  console.log("File:", req.file);
  console.log("User:", res.locals.user); // Add this to verify user data

  try {
    const catData = {
      ...req.body,
      owner: res.locals.user.user_id, // Make sure owner is set
      filename: req.file ? req.file.filename : null,
    };

    console.log("Cat data to be inserted:", catData); // Add this to verify final data

    const result = await addCat(catData);
    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.status(201).json({
      message: "New cat added.",
      cat_id: result.cat_id,
    });
  } catch (error) {
    console.error("Error adding cat:", error); // Add this for better error logging
    res.status(500).json({ error: error.message });
  }
};

const putCat = async (req, res) => {
  try {
    const result = await modifyCat(req.body, req.params.id, res.locals.user);
    if (result) {
      res.json({ message: "Cat updated successfully" });
    } else {
      res.status(404).json({ error: "Cat not found or unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCat = async (req, res) => {
  try {
    const result = await removeCat(req.params.id, res.locals.user);
    if (result) {
      res.json({ message: "Cat deleted successfully" });
    } else {
      res.status(404).json({ error: "Cat not found or unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getCat, getCatById, postCat, putCat, deleteCat };
