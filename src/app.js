import express from "express";

const app = express();

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to my REST API");
});

app.get("/api/v1/cat", (req, res) => {
  const cat = {
    cat_id: 552,
    name: "Jorma",
    birthdate: "2009-11-22",
    weight: 7,
    owner: "Heikki",
    image: "https://loremflickr.com/320/240/cat",
  };

  res.json(cat);
});

export default app;
