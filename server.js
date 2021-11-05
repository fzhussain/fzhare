const express = require("express");
const path = require("path");
app = express();


const PORT = process.env.PORT || 3000;

app.use(express.json());  // A middleware | As express bydefault doesnot accepts json data
app.use(express.static('public'))
const connectDB = require('./config/db');
connectDB();

// Template Engines
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


// Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});




/*
Notes->
1. MongoDB used in this project is a cloud based MongoDB not local mongoDB
2. View engines are useful for rendering web pages. There are many view engines available in the market like Mustache, Handlebars, EJS, etc but the most popular among them is EJS which simply stands for Embedded JavaScript. It is a simple templating language/engine that lets its user generate HTML with plain javascript.
*/