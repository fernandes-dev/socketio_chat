const mongoose = require('mongoose')
const os = require('os')

let db

if (os.hostname()=== process.env.LOCAL_NAME) {
    db = process.env.DB_LOCAL
} else {
    db = process.env.DB_ONLINE
}

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

mongoose.Promise = global.Promise

module.exports = mongoose
