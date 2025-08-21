const fs = require("fs");

function cat(path) {
    fs.readFile(path, "utf8", (error, data) => {
        if (error) {
            console.log(`Error reading ${path}:`, error);
            return;
        }
        console.log(data);
    });
}

const filePath = process.argv[2];

if (!filePath) {
    console.log('Add a file path');
    process.exit();
}

cat(filePath);