/*
  Requirements:
    1- Setup Express Server
    2- Install and configure Express.js
    3- Set up a basic server listening on a specified port.
*/

// Import express and setup the server
const express = require("express");
const app = express();
const port = 3000;

// Middleware with JSON
app.use(express.json());

// ValidetionsWithMiddleware
app.use((req, res, next) => {
  const { method, path, body } = req;

  // Validations with method on route /todos
  switch (method) {
    case "GET":
      const [id] = path.split("/").slice(2);
      if (id && isNaN(id))
        return next({ message: "id => must be a number !!" });
      break;
    case "POST":
      if (!body.sid || !body.item) {
        return next({
          message: "In complete data must be sent => (item: any, sid: number)",
        });
      } else if (isNaN(body?.sid)) {
        return next({ message: "sid => must be a number !!" });
      }
      break;
    case "PUT":
      if (!body.id || !body.item) {
        return next({
          message: "In complete data must be sent => (item: any, id: number)",
        });
      } else if (isNaN(body?.id)) {
        return next({ message: "id => must be a number !!" });
      }
      break;
    case "DELETE":
      if (!body.id || !body.sid) {
        return next({
          message: "In complete data must be sent => (id: number, sid: number)",
        });
      } else if (isNaN(body?.id) || isNaN(body?.sid)) {
        return next({ message: "(id, sid) => must be a number !!" });
      }
      break;
    default:
      next({ message: "This method not allowed !!", code: 405 });
  }

  // Send request to todoRouter
  next();
});

// Routes
const todoRouter = require("./routes/todoRouter");
app.use(["/todos", "/todo"], todoRouter);

// Error Handler
app.use((err, req, res, next) =>
  res.status(err.code || 400).send({ message: err.message })
);

// Server listening on a specified port.
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
