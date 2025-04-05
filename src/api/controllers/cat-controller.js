import {
  addCat,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat,
} from "../models/cat-model.js";

const getCat = async (req, res, next) => {
  try {
    const cats = await listAllCats();
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const getCatById = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);
    if (!cat) {
      const err = new Error("Cat not found");
      err.status = 404;
      return next(err);
    }
    res.json(cat);
  } catch (err) {
    next(err);
  }
};

const postCat = async (req, res, next) => {
  try {
    const catData = {
      ...req.body,
      owner: res.locals.user.user_id,
      filename: req.file ? req.file.filename : null,
    };

    const result = await addCat(catData);
    if (result.error) {
      const err = new Error(result.error);
      err.status = 400;
      return next(err);
    }
    res.status(201).json({
      message: "New cat added.",
      cat_id: result.cat_id,
    });
  } catch (err) {
    next(err);
  }
};

const putCat = async (req, res, next) => {
  try {
    const result = await modifyCat(req.body, req.params.id, res.locals.user);
    if (!result) {
      const err = new Error("Cat not found or unauthorized");
      err.status = 404;
      return next(err);
    }
    res.json({ message: "Cat updated successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteCat = async (req, res, next) => {
  try {
    const result = await removeCat(req.params.id, res.locals.user);
    if (!result) {
      const err = new Error("Cat not found or unauthorized");
      err.status = 404;
      return next(err);
    }
    res.json({ message: "Cat deleted successfully" });
  } catch (err) {
    next(err);
  }
};
export { getCat, getCatById, postCat, putCat, deleteCat };
