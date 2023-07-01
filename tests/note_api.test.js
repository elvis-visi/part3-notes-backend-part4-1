const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')



//The tests only use the Express application defined in the app.js file, 
//which does not listen to any ports:
const app = require('../app')

const api = supertest(app)
const Note = require('../models/note')

//nitialize the database before every test with the beforeEach function


/*
The database is cleared out at the beginning, and after that, we save 
the two notes stored in the initialNotes array to the database. By doing 
this, we ensure that the database is in the same state before every test is
 run.
*/

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  //array of promises for saving each of the items to the database.
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)

  /*transforming an array of promises into a single promise, that will be 
  fulfilled once every promise in the array passed to it as a parameter is 
  resolved. 

  Promise.all(promiseArray) waits until every promise for saving a note is 
  finished, meaning that the database has been initialized.


  If the promises need to be executed in a particular order, this will be
   problematic. In situations like this, the operations can be executed inside
    of a for...of block, that guarantees a specific execution order
  */
})



//Promise.all executes the promises it receives in parallel.
//

/*
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})


*/

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

  const contents = notesAtEnd.map(n => n.content)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})


test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
})






test('note without content is not added', async () => {

  const newNote = {
    important: true
  }

  //check the state stored in the database after the saving operation, 
  //by fetching all the notes of the application.
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)

})

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultNote.body).toEqual(noteToView)
})


test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})



test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length)
})


test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
})

afterAll(async () => {
  await mongoose.connection.close()
})


/*
The test imports the Express application from the app.js module and wraps
it with the supertest function into a so-called superagent object. 
This object is assigned to the api variable and tests can use it for 
making HTTP requests to the backend.

Our test makes an HTTP GET request to the api/notes url and verifies 
that the request is responded to with the status code 200. The test 
also verifies that the Content-Type header is set to application/json, 
indicating that the data is in the desired format.




In this code, api is an instance of the supertest library, which is a 
wrapper around the Express application defined in the app.js file. 
Supertest is a library designed for testing HTTP servers, and it provides
a high-level abstraction for testing HTTP API endpoints.

By wrapping the app object with supertest, you can now use api to make HTTP
requests to your application's API endpoints without the need to start the 
server on a specific port. This makes testing more convenient and faster 
since the requests are made directly to the Express application.

For example, you can use api to make GET, POST, PUT, and DELETE requests to 
your application's endpoints and then test the responses to make sure they 
meet the expected criteria.


*/