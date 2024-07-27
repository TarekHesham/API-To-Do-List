/*
  To-Do Routes:
    [GET] /todos     => Fetch all to-do items.
    [GET] /todos/:id => Fetch one to-do item with this id.
    [POST] /todos    => Add a new to-do item.
    [PUT] /todos     => Update an existing to-do item.
    [DELETE] /todos  => Delete a to-do item.
*/

// Import express and create a router
const express = require("express");
const todoRouter = express.Router();
const db = require("../services/db");

// GET /todos: Fetch all to-do items.
todoRouter.get("/", async (req, res, next) => {
  const results = await db.query("select * from items");
  res.status(200).send(results);
});

// GET /todos/:id: Fetch one to-do item with this id.
todoRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  // Get data from db
  const results = await db.query("SELECT * FROM items WHERE id=?", [id]);

  // Check data is valid
  if (!results.length) return next({ message: "Not Found !", code: 404 });

  res.status(200).send(results);
});

// POST /todos: Add a new to-do item.
todoRouter.post("/", async (req, res, next) => {
  try {
    // Get body items and validate data
    const { item, sid } = req.body;

    /**
     * We will insert new item and id (AUTO-INCREMENT) and status defualt value is false
     * sid = ID-Super:
     * ID-Super, is the user's identifier for connecting the relationship between the object and its owner
     */
    const result = await db.query(
      `INSERT INTO items (item, sid) VALUES ('${item}', '${sid}')`
    );

    if (!result?.affectedRows)
      return next({ message: "Error in DB Server...", code: 500 });

    res.status(201).send({ success: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// PUT /todos/: Update an existing to-do item.
todoRouter.put("/", async (req, res, next) => {
  try {
    const { id, item } = req.body;

    const result = await db.query(
      `UPDATE items
        SET item = '${item}'
        WHERE id = '${id}';`
    );

    if (!result?.affectedRows)
      return next({ message: "Error in DB Server...", code: 500 });

    res.status(200).send({ success: true, action: "Edit item..." });
  } catch (err) {
    next({ message: err.message, code: 500 });
  }
});

// DELETE /todos/: Delete a to-do item.
todoRouter.delete("/", async (req, res, next) => {
  try {
    // id for item & sid for owner its step to security
    const { id, sid } = req.body;

    const result = await db.query(
      `DELETE FROM items WHERE id='${id}' AND sid='${sid}';`
    );

    if (!result?.affectedRows) return next({ message: "server error" });

    res.status(200).send({ success: true, action: "Delete item..." });
  } catch (err) {
    next({ message: err.message, code: 500 });
  }
});

// Export route to import in main.js
module.exports = todoRouter;
