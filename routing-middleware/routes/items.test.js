const request = require("supertest");
const app = require('../app');
let items = require("../fakeDb");

beforeEach(() => {
  items.length = 0;
  items.push({ name: "popsicle", price: 1.45 });
});

describe("GET /items", () => {
    test("responds with json list of items", async () => {
        const res = await request(app).get("/items");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("price");
        }
    })
})

describe("POST /items", () => {
    test("add a new item", async () => {
        const res = await request(app).post("/items").send({ name: "cheerios", price: 3.40 });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { name: "cheerios", price: 3.40 }});

        expect(items.length).toBe(2);
        expect(items[1]).toEqual({ name: "cheerios", price: 3.40 });
    })

    test("expect 400 if added name or price missing", async () => {
        const res = await request(app).post("/items").send({ name: "milk" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    })
})

describe("GET /items/:name", () => {
    test("return single item", async () => {
        const res = await request(app).get("/items/popsicle");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ name: "popsicle", price: 1.45 });
    })    

    test("expect 404 if name is incorrect", async () => {
        const res = await request(app).get("/items/wrongname");

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
    })
})

describe("PATCH /items/:name", () => {
    test("update an existing item", async () => {
        const res = await request(app).patch("/items/popsicle").send({ name: "chocolate popsicle", price: 5.40 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "chocolate popsicle", price: 5.40 }});

        expect(items[0]).toEqual({ name: "chocolate popsicle", price: 5.40 });
    })

    test("expect 404 if item not found", async () => {
        const res = await request(app).patch("/items/wrongname").send({ name: "noname" });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
    })
})

describe("DELETE /items/:name", () => {
    test("responds with item deleted", async () => {
        const res = await request(app).delete("/items/popsicle");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted" });

        expect(items.find(i => i.name === "popsicle")).toBeUndefined();
        expect(items.length).toBe(0);
    })

    test("expect 404 if item not found", async () => {
        const res = await request(app).delete("/items/wrongname");

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
    })
})