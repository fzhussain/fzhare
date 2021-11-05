require('dotenv').config();

const mongoose = require('mongoose');

function connectDB() {
    // Database connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const connection = mongoose.connection;

    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.once('open', () => {
        console.log('Database connected!');
    });

}

module.exports = connectDB;

/*
NOTE ->
1. Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
*/