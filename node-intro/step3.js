const fs = require("fs");
const axios = require("axios");

function output(content, out) {
    if (out) {
        fs.writeFile(out, content, "utf8", (error) => {
            if (error) {
                console.log(`Couldn't write ${out}:`, error);
                process.exit(1);
            }
        });
    } else {
        console.log(content);
    }
}

function cat(path, out) {
    fs.readFile(path, "utf8", (error, data) => {
        if (error) {
            console.log(`Error reading ${path}:`, error);
            process.exit(1);
        } else {
            output(data, out);
        }    
    });
}

async function webCat(url, out) {
    try {
        const response = await axios.get(url);
        output(response.data, out);
    } catch (error) {
        console.log(`Error fetching ${url}:`, error);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
let out;
let input;

if (args[0] === "--out") {
    out = args[1];
    input = args[2];
} else {
    input = args[0];
}

if (input.slice(0, 4) === 'http') {
  webCat(input, out);
} else {
  cat(input, out);
}