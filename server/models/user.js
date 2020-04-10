const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const User = new Schema({name: String, options: {}});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);

const UserData = new Schema({username: String, formulas: {gradient:[],distance:[],color:[]}, images: [], templates: [], creations: [], friends: [], followers: []});
module.exports = mongoose.model('UserData', UserData);