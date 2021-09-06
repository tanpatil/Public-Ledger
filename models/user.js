var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    DisplayName: String,
    AccountLimit: String,
    TrustFactor: String,
    username: String,
    password: String, 
    securityQuestion: String,
    securityAnswer: String,
    role: String,
})

module.exports = mongoose.model("user", userSchema)