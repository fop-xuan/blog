const mongoose = require('mongoose')
const lableSchema = new mongoose.Schema({
    lable: String
})
module.exports = mongoose.model('Lable', lableSchema)