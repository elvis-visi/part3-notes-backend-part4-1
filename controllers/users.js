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
    const users = await User.find({})
    response.json(users)
})


module.exports = usersRouter

/*
The password sent in the request is not stored in the database. We store the hash of the password that is generated with the bcrypt.hash function.
*/