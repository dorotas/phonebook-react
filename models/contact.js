const mongoose = require('mongoose')

const url = process.env.MONGODB_URL;

console.log('connecting to', url)

mongoose.set('strictQuery',false)
mongoose.connect(url)
    .then( result => console.log('Connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB:', error.message));

const contactSchema = new mongoose.Schema({
    name: String,
    phoneNumber: Number,
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        // returnedObject.phoneNumber = returnedObject.phoneNumber.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)
