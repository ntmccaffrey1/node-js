const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv-flow').config();

const userRoutes = require('./routes/userRoutes');
const dogRoutes = require('./routes/dogRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Middleware
app.use(cors({
    origin: 'https://localhost:3000',
    credentials: true
}))

//Routes
app.get('/', (req, res) => {
    res.json({ msg: 'API is working'});
})

app.use('/', userRoutes);
app.use('/', dogRoutes);

module.exports = app;