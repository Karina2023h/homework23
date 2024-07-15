const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/todo")
  .then(() => console.log("MongoDB підключено..."))
  .catch((err) => console.error("Помилка підключення MongoDB:", err));

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
    console.log("Завдання отримані:", todos);
    res.send(todos);
  } catch (err) {
    console.error("Не вдалося отримати завдання:", err);
    res.status(500).send("Не вдалося отримати завдання");
  }
});

app.post("/todos", async (req, res) => {
  console.log("Створення нового завдання:", req.body);
  try {
    const todo = new Todo({
      text: req.body.text,
      completed: req.body.completed || false,
    });
    await todo.save();
    console.log("Завдання створено:", todo);
    res.send(todo);
  } catch (err) {
    console.error("Не вдалося створити завдання:", err);
    res.status(500).send("Не вдалося створити завдання");
  }
});

app.get("/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  console.log(`Отримання завдання з ID: ${todoId}`);
  try {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      console.error(`Завдання з ID ${todoId} не знайдено`);
      return res.status(404).send("Todo не знайдено");
    }
    console.log("Завдання отримано:", todo);
    res.send(todo);
  } catch (err) {
    console.error("Не вдалося отримати завдання:", err);
    res.status(500).send("Не вдалося отримати завдання");
  }
});

app.put("/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  console.log(`Оновлення завдання з ID: ${todoId}`);
  try {
    const todo = await Todo.findByIdAndUpdate(
      todoId,
      {
        text: req.body.text,
        completed: req.body.completed,
      },
      { new: true }
    );
    if (!todo) {
      console.error(`Завдання з ID ${todoId} не знайдено`);
      return res.status(404).send("Todo не знайдено");
    }
    console.log("Завдання оновлено:", todo);
    res.send(todo);
  } catch (err) {
    console.error("Не вдалося оновити завдання:", err);
    res.status(500).send("Не вдалося оновити завдання");
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    console.log(`Спроба видалити завдання з id: ${todoId}`);

    const todo = await Todo.findByIdAndDelete(todoId);

    if (!todo) {
      console.error(`Завдання з ідентифікатором ${todoId} не знайдено`);
      return res.status(404).send("Todo не знайдено");
    }

    console.log(`Завдання з ідентифікатором ${todoId} успішно видалено`);
    res.send(todo);
  } catch (err) {
    console.error("Не вдалося видалити завдання:", err);
    res.status(500).send("Не вдалося видалити завдання");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Сервер працює на порту ${port}`));
