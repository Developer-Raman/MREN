const mongoose = require('mongoose')

const Schema = mongoose.Schema

//_id: { type: Object, required: true},
    
const Files = new Schema(
    {
        DOMAIN: {type: String},
        filename: {type: String},
        IDCRED: {type: String},
        SERVER: {type: String},
        VALCRED: {type: String},
    },
    { timestamps: true},
)

module.exports = mongoose.model('files', Files)