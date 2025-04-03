import { addCat, findCatById, listAllCats } from "../models/cat-model.js";

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  console.log("Form data:", req.body);
  console.log("File:", req.file);

  const catData = {
    ...req.body,
    filename: req.file ? req.file.filename : null,
  };

  const result = addCat(catData);
  if (result.error) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(201).json({
    message: "New cat added.",
    cat_id: result.cat_id,
  });
};

const putCat = (req, res) => {
  res.json({ message: "Cat item updated" });
};

const deleteCat = (req, res) => {
  res.json({ message: "Cat item deleted" });
};

export { getCat, getCatById, postCat, putCat, deleteCat };
