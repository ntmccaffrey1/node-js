const express = require('express');
const parseNumbers = require('./middleware/parseNumbers');
const errorHandler = require('./middleware/errorHandler');
const { modeHelper } = require('./middleware/modeHelper');

const app = express();
app.set("json spaces", 2);

app.get('/mean', parseNumbers, (req, res) => {
    const nums = req.numbers;
    const sum = nums.reduce((acc, cur) => acc + cur, 0);
    const mean = sum / nums.length;

    res.json({ response: { operation: "mean", value: mean }});
})

app.get('/median', parseNumbers, (req, res) => {
    const nums = [...req.numbers].sort((a, b) => a - b);
    const mid = Math.floor(nums.length / 2);
    const median = nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;

    res.json({ response: { operation: "median", value: median }});
})

app.get('/mode', parseNumbers, (req, res) => {
    const nums = req.numbers;
    const mode = modeHelper(nums);

    res.json({ response: { operation: "mode", value: mode }});
})

app.use(errorHandler);

module.exports = app;