process.env.NODE_ENV = 'test';

const request = require("supertest");
const app = require('../app');
const db = require("../db");

let isbn_id;

test("1 + 1 = 2", () => {
  expect(1 + 1).toBe(2);
});

beforeEach(async () => {
    await db.query("DELETE FROM books");
    
    const insert = await db.query(`
        INSERT INTO 
            books (isbn, amazon_url, author, language, pages, publisher, title, year)
        VALUES (
            '9780544003415',
            'https://amazon.com/hobbit',
            'J.R.R. Tolkien',
            'en',
            310,
            'Houghton Mifflin',
            'The Hobbit',
            1937)
        RETURNING isbn`);    
    
    isbn_id = insert.rows[0].isbn;
});

afterEach(async function () {
  await db.query("DELETE FROM books");
});


afterAll(async function () {
  await db.end()
});

describe("GET /books", () => {
    test("Get list of all books", async () => {
        const res = await request(app).get("/books");
        expect(res.statusCode).toBe(200);
        const { books } = res.body;
        expect(Array.isArray(books)).toBe(true);
        expect(books.length).toBe(1);
        expect(books[0]).toHaveProperty("isbn", isbn_id);
    })
})

describe("GET /books/:isbn", () => {
    test("Get a book by isbn.", async () => {
        const res = await request(app).get(`/books/${isbn_id}`);
        const book = res.body.book;

        expect(book).toHaveProperty("isbn");
        expect(book.isbn).toBe(isbn_id);
    })

    test("Responds with 404 if can't find book.", async () => {
        const res = await request(app).get('/books/1123456789');

        expect(res.statusCode).toBe(404);
    })
})

describe("POST /books", () => {
    test("Add a new book.", async () => {
        const res = await request(app).post("/books").send({ 
            isbn: '9990001112223',
            amazon_url: 'https://amazon.com/hobbit',
            author: 'J.R.R. Tolkien',
            language: 'en',
            pages: 310,
            publisher: 'Houghton Mifflin',
            title: 'The Hobbit',
            year: 1937
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.book).toHaveProperty("isbn");
    })

    test("expect 400 if error adding book.", async () => {
        const res = await request(app).post("/books").send({ year: 1937 });

        expect(res.statusCode).toBe(400);
    })
})

describe("PUT /books/:isbn", () => {
    test("Update an existing book by isbn.", async () => {
        const res = await request(app).put(`/books/${isbn_id}`).send({ 
            amazon_url: 'https://amazon.com/hobbit',
            author: 'J.R.R. Tolkien',
            language: 'en',
            pages: 310,
            publisher: 'Houghton Mifflin',
            title: 'NEW BOOK TITLE',
            year: 1937
        });

        expect(res.body.book).toHaveProperty("isbn");
        expect(res.body.book.title).toBe('NEW BOOK TITLE');
    })    

    test("Prevent a bad book update with a fake field.", async () => {
        const res = await request(app).put(`/books/${isbn_id}`).send({ 
            amazon_url: 'https://amazon.com/hobbit',
            author: 'J.R.R. Tolkien',
            language: 'en',
            pages: 310,
            publisher: 'Houghton Mifflin',
            title: 'NEW BOOK TITLE',
            year: 1937,
            fakeField: 'FAKEFIELD'
        });

        expect(res.statusCode).toBe(400);
    })

    test('expect 404 if book is not found.', async () => {
        const res = await request(app).put('/books/DOES_NOT_EXIST').send({
            amazon_url: 'https://amazon.com/hobbit',
            author: 'J.R.R. Tolkien',
            language: 'en',
            pages: 310,
            publisher: 'Houghton Mifflin',
            title: 'NEW BOOK TITLE',
            year: 1937
        });
        expect(res.statusCode).toBe(404);
    });
})

describe("DELETE /books/:isbn", () => {
    test("Delete a single book by isbn.", async () => {
        const res = await request(app).delete(`/books/${isbn_id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Book deleted" });
    })   
})