const express = require("express");
const bodyParser = require("body-parser");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");

const app = express();
const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ books: [] }).write();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/books", (req, res) => {
  res.render("books", {
    books: db.get("books").value()
  });
});

app.post("/books", (req, res) => {
  req.body.id = shortid.generate();

  db.get("books")
    .push(req.body)
    .write();
  res.redirect("back");
});

app.get("/books/:id/update", (req, res) => {
  let id = req.params.id;

  res.render("update-title", {
    id: id
  });
});

app.post("/books/update", (req, res) => {
  db.get("books")
    .find({ id: req.body.id })
    .assign({ title: req.body.title })
    .write();

  res.redirect("/books");
});

app.get("/books/:id/delete", (req, res) => {
  let id = req.params.id;

  db.get("books")
    .remove({ id: id })
    .write();

  res.redirect("back");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
