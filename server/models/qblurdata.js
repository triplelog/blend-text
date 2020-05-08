const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QblurData = new Schema({username: String, formulas: {gradient:[],distance:[],color:[]}, images: [], templates: [], creations: [], friends: [], followers: []});
module.exports = mongoose.model('QblurData', QblurData);