const fs = require("fs");
const axios = require("axios");

function cat(path) {
    fs.readFile(path, "utf8", (error, data) => {
        if (error) {
            console.log(`Error reading ${path}:`, error);
            return;
        }
        console.log(data);
    });
}

async function webCat(url) {
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (error) {
        console.log(`Error fetching ${url}:`);
        if (error.response) {
            console.log(`Error: Request failed with status code ${error.response.status}`);
        } else if (error.request) {
            console.error("No response received from server");
        } else {
            console.error("Error:", error.message);
        }
    }
}

const arg = process.argv[2];

if (!arg) {
    console.log('Add a file path or url');
    process.exit(1);
}

if (arg.startsWith("http") || arg.startsWith("https")) {
    webCat(arg);
} else {
    cat(arg);
}