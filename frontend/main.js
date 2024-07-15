const apiUrl = "http://localhost:3000/todos";

$(document).ready(function () {
  loadTodos();

  $(".js--form").on("submit", function (e) {
    e.preventDefault();
    addTodo();
  });

  function loadTodos() {
    console.log("Завантаження todo...");
    $.get(apiUrl, function (todos) {
      console.log("Todo завантажені:", todos);
      todos.forEach((todo) => renderTodo(todo));
    });
  }

  function addTodo() {
    const value = $(".js--form__input").val().trim();
    if (value === "") return;
    const newTodo = {
      text: value,
      completed: false,
    };
    console.log("Новий todo створений:", newTodo);
    $.post({
      url: apiUrl,
      contentType: "application/json",
      data: JSON.stringify(newTodo),
      success: function (todo) {
        console.log("Завдання успішно додано");
        renderTodo(todo);
        $(".js--form__input").val("");
      },
      error: function () {
        console.error("Не вдалося додати завдання");
      },
    });
  }

  function renderTodo(todo) {
    console.log("Відображення todo:", todo);
    const li = $("<li></li>")
      .addClass(`todo-item ${todo.completed ? "todo-item--checked" : ""}`)
      .attr("data-id", todo._id);

    const checkbox = $("<input>")
      .attr("type", "checkbox")
      .prop("checked", todo.completed)
      .on("change", function () {
        todo.completed = $(this).prop("checked");
        console.log("Зміна стану todo:", todo);
        updateTodo(todo);
        li.toggleClass("todo-item--checked", todo.completed);
      });

    const span = $("<span></span>")
      .addClass("todo-item__description")
      .text(todo.text)
      .on("click", function () {
        console.log("Клік по todo:", todo.text);
        $("#taskText").text(todo.text);
        $("#taskModal").modal("show");
      });

    const button = $("<button></button>")
      .addClass("todo-item__delete btn btn-danger")
      .text("Видалити")
      .on("click", function () {
        console.log("Видалення todo з ID:", todo._id);
        deleteTodo(todo._id);
        li.remove();
      });

    li.append(checkbox, span, button);
    $(".js--todos-wrapper").append(li);
  }

  function updateTodo(todo) {
    console.log("Оновлення todo з ID:", todo._id);
    $.ajax({
      url: `${apiUrl}/${todo._id}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(todo),
      success: function () {
        console.log("Todo оновлено");
      },
      error: function () {
        console.error("Не вдалося оновити завдання");
      },
    });
  }

  function deleteTodo(id) {
    console.log("Видалення todo з ID:", id);
    $.ajax({
      url: `${apiUrl}/${id}`,
      type: "DELETE",
      success: function () {
        console.log("Todo видалено");
      },
      error: function () {
        console.error("Не вдалося видалити завдання");
      },
    });
  }
});
