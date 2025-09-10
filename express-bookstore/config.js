/** Common config for bookstore. */

/** THE PREVIOUS SETUP DID NOT WORK SO I HAD TO HACK THIS TOGETHER FOR TESTS TO RUN */

let DB_URI = `postgresql://mccaff:devpw123@localhost:5432/books-test`;

if (process.env.NODE_ENV === "test") {
  DB_URI = process.env.DATABASE_URL || "postgresql://mccaff:devpw123@localhost:5432/books-test";
} else {
  DB_URI = process.env.DATABASE_URL || "postgresql://mccaff:devpw123@localhost:5432/books";
}

module.exports = { DB_URI };