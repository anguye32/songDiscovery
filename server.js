const express = require('express');
const path = require('path');
const app = express();
const port = 5502;
const http = require('http');
const fs = require("fs");
const bodyParser = require("body-parser");
require("dotenv").config({ path: path.resolve(__dirname, '.env') });

app.use(express.static(__dirname))
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.get('/callback', (req, res) => {
    res.render('user')
});

const signUpHandling = require('./middleware/signUpHandling')

const logInHandling = require('./middleware/LogInHandling')

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/signup", signUpHandling)

app.use("/signin", logInHandling)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
