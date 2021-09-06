var mongoose = require('mongoose')

var pubmsgSchema = new mongoose.Schema({
     EncryptedText: String, 
     msgid: String,
     sender: String,
})

module.exports = mongoose.model("pubmsg", pubmsgSchema)