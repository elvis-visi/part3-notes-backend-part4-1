const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User

/*
The type of the field is ObjectId that references note-style documents. Mongo does not inherently know that this is a field that references notes, the syntax is purely related to and defined by Mongoose.





    You define your Mongoose schema and specify which fields should be unique. In your case, the username field is set to unique: true.

    You add the uniqueValidator plugin to your schema with userSchema.plugin(uniqueValidator).

    When you try to save a document using this schema, Mongoose runs all its usual pre-save validation steps. The uniqueValidator plugin adds an extra step here.

    For each field in the document that is marked as unique, the uniqueValidator plugin checks if there is an existing document in the database with the same value for that field.

    If a duplicate value is found, the plugin stops the save operation and returns a validation error.

    If no duplicate values are found, the save operation proceeds as normal.


*/