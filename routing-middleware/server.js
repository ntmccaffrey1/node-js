const app = require("./app");
const items = require("./fakeDb");

items.push(
  { name: "popsicle", price: 1.45 },
  { name: "cheerios", price: 3.40 }
);

app.listen(3000, function () {
    console.log('App on port 3000');
})