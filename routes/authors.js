const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

//all auhtors
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

//new author form
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});
//adding new author
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating Author",
    });
  }
});

//getting one author
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    res.render("authors/show", {
      author: author,
      booksByAuthor: books,
    });
  } catch (err) {
    res.redirect("/");
  }
});

//edit author form
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author });
  } catch {
    res.redirect("/authors");
  }
});
//editing author
router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Error Updating Author",
      });
    }
  }
});

//deleting author
router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findOneAndDelete({ _id: req.params.id });
    res.redirect("/authors");
  } catch {
    if (author != null) {
      res.render("authors/show", {
        author: author,
        errorMessage: "Could not remove author",
      });
    } else {
      res.redirect("/");
    }
  }
});

module.exports = router;
