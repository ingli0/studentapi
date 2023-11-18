const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type : String,
        required: true
    }
})

const accdb = mongoose.model('accdb', schema);

module.exports = accdb;