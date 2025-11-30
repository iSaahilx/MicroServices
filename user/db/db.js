const mongoose = require('mongoose');


function connect(){
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGODB_URI (or MONGO_URI) is not defined');
    }
    mongoose.connect(uri).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log(err);
    });
}
module.exports = { connect };