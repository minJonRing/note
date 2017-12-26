const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const article = new Schema({
    title: { type: String },
    foreword: { type: String },
    content: { type: String },
    tag: { type: Array },
    classify: { type: String },
    create_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Article', article);