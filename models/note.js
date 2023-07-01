/*only defines the Mongoose schema for notes*/

const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)

/*
In stark contrast to the conventions of relational databases, references are now stored in both documents: the note references the user who created it, and the user has an array of references to all of the notes created by them.
*/