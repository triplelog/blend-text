const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QblurData = new Schema({username: String, formulas: {gradient:[],distance:[],overlay:[],filter:{}}, images: [], creations: [], friends: [], followers: [], settings: {language:String,email:String,robot:Number,storage:Number}});
module.exports = mongoose.model('QblurData', QblurData);
