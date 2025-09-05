const items = require("./fakeDb");

class Item {
    constructor(name, price) {
        this.name = name;
        this.price = price;

        items.push(this);
    }

    static allItems() {
        return items;
    }

    static updateItem(name, data) {
        let item = Item.findItem(name);

        if (!item) {
            throw { message: "Name not found", status: 404 };
        }

        if (data.name !== undefined) {
            item.name = data.name;
        }      
        
        if (data.price !== undefined) {
            item.price = data.price;
        }

        return item;
    }

    static findItem(name) {
        const item = items.find(i => i.name === name);

        if (!item) {
            throw { message: "Name not found", status: 404 };
        }

        return item;
    }

    static deleteItem(name) {
        const itemIndex = items.findIndex(i => i.name === name);
            
        if (itemIndex === -1) {
            throw { message: "Deleted", status: 404 };
        }
            
        items.splice(itemIndex, 1);
    }
}

module.exports = Item;