var mongoose = require('mongoose')

var confirmedtransactionSchema = new mongoose.Schema({
    trdetails: String
})

module.exports = mongoose.model("confirmedtransaction", confirmedtransactionSchema)