const mongoose = require('mongoose')
const aboutScheam = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: true
    },
    updateTime: {
        type: Date,
        default: Date.now()
    },
    content: String
})

module.exports = mongoose.model('About', aboutScheam)
