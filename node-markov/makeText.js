/** Command-line tool to generate Markov text. */

const fs = require("fs");
const axios = require("axios");
const { MarkovMachine } = require("./markov");

function handleFile(path) {
    fs.readFile(path, "utf8", (error, text) => {
        if (error) {
            console.log(`Error reading ${path}:`, error);
            process.exit(1);
        }
        let mm = new MarkovMachine(text);
        console.log(mm.makeText());
    });
}

async function handleUrl(url) {
    try {
        const { data: text } = await axios.get(url);
        let mm = new MarkovMachine(text);
        console.log(mm.makeText());
    } catch (error) {
        console.log(`Error fetching ${url}:`, error);
        process.exit(1);
    }
}

const [type, source] = process.argv.slice(2);

if (!type || !source) {
    console.log("Define a type or source");
    process.exit(1);
}

if (type === "file") {
    handleFile(source);
} else if (type === "url") {
    handleUrl(source);
} else {
    console.error(`Unknown type "${type}". Use "file" or "url".`);
    process.exit(1);
}  