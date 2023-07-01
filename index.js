const app = require('./app')  // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})



/*
The index.js file only imports the actual application from the app.js file
 and then starts the application.


app.listen() is a method in Express.js used to start a server that listens
 for incoming client connections on the specified port. It binds and
 listens for connections on a specified host and port, creating an
 HTTP server behind the scenes. When the server is successfully started
 and listening for connections,
it will execute the provided callback function.



When the statement says "tested at the level of HTTP API calls without
actually making calls via HTTP over the network", it means that the
application can be tested by simulating HTTP requests and responses,
 without having to make real network requests.
      By separating the Express app from the web server, it becomes easier to
  write tests for the application logic, as you can create mock requests
  and responses that the application should handle, without actually
  starting a server and sending HTTP requests over the network. This is
  useful when you want to test how your application logic handles different
  scenarios and edge cases without the overhead of network latency and
  potential issues related to network connectivity.
      This approach is more efficient, faster, and less error-prone since you
don't have to deal with network-related issues during testing. You can
focus on testing the application's functionality and ensuring that it
 behaves correctly in response to different types of requests and input
 data.
*/