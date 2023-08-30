if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const Book = require("./models/book");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);
const authorRouter = require("./routes/authors");
app.use("/authors", authorRouter);
const bookRouter = require("./routes/books");
app.use("/books", bookRouter);

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("Connected to Database"));
mongoose.connection.on("error", (error) => console.error(error));

app.delete("/deleting", async (req, res) => {
  await Book.deleteOne({ _id: "64ee4f1fad0f1ba8416d0430" });
  res.render('/')
  console.log("sucees");
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
