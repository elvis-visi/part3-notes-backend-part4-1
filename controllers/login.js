const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {

    const { username, password } = request.body;

    //get the user with the corresponding username
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    //check whether there is a user with the entered username
    //and if the entered pasword is correct
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    //if the above passes then the backend generated a TOKEN
    const userForToken = {
        username: user.username,
        id: user._id,
    }

    //signed digitally, making it impossible to falsify (with cryptographic means)
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 }
    )

    /*
    Once the token expires, the client app needs to get a new token. Usually, this happens by forcing the user to re-login to the app.
    */
    response
        .status(200)
        .send({ token, username: user.username, name: user.name })

})

module.exports = loginRouter

/*
The token has been digitally signed using a string from the environment variable SECRET as the secret. The digital signature ensures that only parties who know the secret can generate a valid token. 
*/