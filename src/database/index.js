const mongoose = require('mongoose')
const os = require('os')

let db = ''

if (os.hostname()==='EDUARDO') {
    db = 'mongodb://localhost:27017/chat'
} else {
    db = ''
}

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.Promise = global.Promise

module.exports = mongoose
