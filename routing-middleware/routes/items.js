const Item = require('../item');
const express = require('express');
const router = express.Router();

router.get("", (req, res, next) => {
    try {
        return res.json(Item.allItems());
    } catch (e) {
        return next(e);
    }
})

router.post("", (req, res, next) => {
    try {
        const { name, price } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Name is required and must be a string."});
        }

        if (price === undefined || typeof price !== "number" || price < 0) {
            return res.status(400).json({ error: "Price is required and must be a number."});
        }

        const newItem = new Item(name, price);
        return res.status(201).json({ added: { name: newItem.name, price: newItem.price }});
    } catch (e) {
        return next(e);
    }
})    

router.get("/:name", (req, res, next) => {
    try {
        const foundItem = Item.findItem(req.params.name);
        return res.json(foundItem);
    } catch (e) {
        return next(e);
    }
})

router.patch("/:name", (req, res, next) => {
    try {
        let updateItem = Item.updateItem(req.params.name, req.body);
        return res.json({ updated: { name: updateItem.name, price: updateItem.price }});
    } catch (e) {
        return next(e);
    }
}) 

router.delete("/:name", (req, res, next) => {
    try {
        Item.deleteItem(req.params.name);
        return res.json({ message: "Deleted" });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;