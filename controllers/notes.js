const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body

  //decodes the token, or returns the Object which the token was based on
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }


  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()

})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter

/*
Limiting creating new notes to logged-in users post request must have a valid token note saved in the list of the user identified by the token
 
There are several ways of sending the token from the browser to the server. We will use the Authorization header. The header also tells which authentication scheme is used
This can be necessary if the server offers multiple ways to 
authenticate. Identifying the scheme tells the server how the attached credentials should be interpreted.

To create a note basically:
1.log in get token
1.1 then to create a token post request, in the authorization header -> scheme and auth credentials
bearer + token 

2. Now, get the authorization from the authorization header in the request
2.1 decode it, if valid then proceed to add the note to the DB


The object decoded from the token contains the username and id fields, which tell the server who made the request.

If the token is missing or it is invalid, the exception JsonWebTokenError is raised. 
*/