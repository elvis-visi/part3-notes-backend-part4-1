const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {

    const { username, name, password } = request.body;

    //
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    //create new User, an instance of the User model
    // a single document in the User collection
    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save();

    response.status(201).json(savedUser)


})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('notes', { content: 1, important: 1 })

    response.json(users)
})


module.exports = usersRouter

/*
The password sent in the request is not stored in the database. We store the hash of the password that is generated with the bcrypt.hash function.

Populate: mongoose join done using populate
With join queries in Mongoose, nothing can guarantee that the state between the collections being joined is consistent, meaning that if we make a query that joins the user and notes collections, the state of the collections may change during the query.

The populate method is chained after the find method making the initial query. The parameter given to the populate method defines that the ids referencing note objects in the notes field of the user document will be replaced by the referenced note documents.

We can use the populate parameter for choosing the fields we want to include from the documents. In addition to the field id:n we are now only interested in content and important.
*/