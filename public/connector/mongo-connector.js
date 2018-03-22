"use strict";

const Mongoose = require('mongoose').Mongoose;
const mongoose = new Mongoose();
const chalk = require("chalk");

const DB_NAME = "StarWarsUnits";

let LOCAL_MONGODB_URI = "mongodb://localhost:27017/" + DB_NAME + "?socketTimeoutMS=120000";
let myMongo = LOCAL_MONGODB_URI;

mongoose.Promise = global.Promise;


console.log('init mongoose connection');
mongoose.connect(myMongo, {}).then(() => {
    console.log('Connected to ' + myMongo);
});

// LOCAL_MONGODB_URI = "mongodb://localhost:27017/" + DB_NAME2 + "?socketTimeoutMS=120000";
// myMongo = LOCAL_MONGODB_URI;
//
// console.log('init mongoose 2 connection');
// mongoose.connect(myMongo, {}).then(() => {
//     console.log('Connected to ' + myMongo);
// });

mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error @ %s. Please make sure MongoDB is running.', chalk.red('✗'), myMongo);
    process.exit();
});


let SWU = new mongoose.Schema(({
    name : String,
    class: [String]
}));

let Mod = new mongoose.Schema(({
    form : String,
    set: String,
    main: String,
    speed: Number,
}));

let Guild = new mongoose.Schema(({
    name : String,
}));

module.exports = {
    mods: mongoose.model('mods', Mod),
    units: mongoose.model('swus', SWU),
    guild: mongoose.model('guild', Guild)
};

