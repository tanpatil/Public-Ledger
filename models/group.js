var mongoose = require('mongoose')

var groupSchema = new mongoose.Schema({
    Name: String,
    Description: String, 
    Members: [user.Schema]
})