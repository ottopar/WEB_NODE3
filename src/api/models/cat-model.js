const catItems = [
  {
    cat_id: 9592,
    cat_name: "Frank",
    weight: 11,
    owner: 3609,
    filename: "f3dbafakjsdfhg4",
    birthdate: "2021-10-12",
  },
  {
    cat_id: 9590,
    cat_name: "Mittens",
    weight: 8,
    owner: 3602,
    filename: "f3dasdfkjsdfhgasdf",
    birthdate: "2021-10-12",
  },
];

const listAllCats = () => {
  return catItems;
};

const findCatById = (id) => {
  return catItems.find((item) => item.cat_id == id);
};

const addCat = (cat) => {
  if (!cat.cat_name || !cat.weight || !cat.owner || !cat.birthdate) {
    return { error: "Missing required fields" };
  }

  const newId = Math.max(...catItems.map((item) => item.cat_id), 0) + 1;
  const newCat = {
    cat_id: newId,
    cat_name: cat.cat_name,
    weight: cat.weight,
    owner: cat.owner,
    filename: cat.filename || null,
    birthdate: cat.birthdate,
  };

  catItems.unshift(newCat);
  return { cat_id: newId };
};

export { listAllCats, findCatById, addCat };
