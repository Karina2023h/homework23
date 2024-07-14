const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/todo")
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

const Todo = mongoose.model(
  "Todo",
  new mongoose.Schema({
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  })
);

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.send(todos);
  } catch (err) {
    console.error("Failed to fetch todos:", err);
    res.status(500).send("Failed to fetch todos");
  }
});

app.post("/todos", async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      completed: req.body.completed || false,
    });
    await todo.save();
    res.send(todo);
  } catch (err) {
    console.error("Failed to create todo:", err);
    res.status(500).send("Failed to create todo");
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send("Todo not found");
    res.send(todo);
  } catch (err) {
    console.error("Failed to fetch todo:", err);
    res.status(500).send("Failed to fetch todo");
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
        completed: req.body.completed,
      },
      { new: true }
    );
    if (!todo) return res.status(404).send("Todo not found");
    res.send(todo);
  } catch (err) {
    console.error("Failed to update todo:", err);
    res.status(500).send("Failed to update todo");
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    console.log(`Attempting to delete todo with id: ${todoId}`);

    const todo = await Todo.findByIdAndDelete(todoId);

    if (!todo) {
      console.error(`Todo with id ${todoId} not found`);
      return res.status(404).send("Todo not found");
    }

    console.log(`Todo with id ${todoId} successfully deleted`);
    res.send(todo);
  } catch (err) {
    console.error("Failed to delete todo:", err);
    res.status(500).send("Failed to delete todo");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
