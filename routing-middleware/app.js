const express = require("express");
const app = express();
const routes = require("./routes/items");
const ExpressError = require("./expressError");

app.use(express.json());

app.use("/items", routes);

app.use((req, res, next) => {
    throw new ExpressError("Item not found.", 404);
})

app.use((e, req, res, next) => {
  res.status(e.status || 500);

  return res.json({
    error: e.message,
  });
});

module.exports = app