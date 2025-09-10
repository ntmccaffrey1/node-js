const { Client } = require("pg");
const { DB_URI } = require("./config");

console.log("Connecting to:", DB_URI); // ✅ ADD THIS

const db = new Client({
  connectionString: DB_URI
});

db.connect()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

module.exports = db;
