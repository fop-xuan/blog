const mongoose = require('mongoose')
const articlesSchema = new mongoose.Schema({
    title: String,
    lable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lable'
    },
    description: {
        type: String,
        default: ''
    },
    comments: [{
        commentTime: {
            type: Date,
            default: Date.now
        },
        commentValue: String,
        commentUser: String,
        replys: [{
            replyTime: {
                type: Date,
                default: Date.now
            },
            replyValue: String,
            replyTarget: String,
            replyUser: String
        }]
    }],
    content: {
        type: String,
        default: ''
    },
    imgUrl: String,
    readNum: {
        type: Number,
        default: 0
    },
    postTime: {
        type: Date,
        default: Date.now
    },
    postYear: {
        type: String,
        default: new Date().getFullYear()
    }
})

module.exports = mongoose.model('Article', articlesSchema )
