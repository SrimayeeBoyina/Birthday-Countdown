// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Change to db.json
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// To handle POST requests, add a custom middleware
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.id = Date.now();
  }
  // Continue to JSON Server router
  next();
});

server.use('/countdowns', router);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
