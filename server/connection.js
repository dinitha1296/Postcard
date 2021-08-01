require('dotenv').config();
const Mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

async function main(callback) {

    const URI = process.env.MONGO_URI;

    // const client = new MongoClient(
    //     URI,
    //     {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true
    //     }
    // );

    // try {
    //     await client.connect();
    //     await callback(client);
    // } catch (e) {
    //     console.error(e);
    //     throw new Error('Unable to Connect to the Database');
    // }

    Mongoose
        .connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('Mongodb connected'))
        .catch(err => {
            console.error(err);
            // throw new Error('Unable to connect to the database');
        })
}

module.exports = main;