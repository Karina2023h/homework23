const apiUrl = "http://localhost:3000/todos";

$(document).ready(function () {
  loadTodos();

  $(".js--form").on("submit", function (e) {
    e.preventDefault();
    addTodo();
  });

  function loadTodos() {
    $.get(apiUrl, function (todos) {
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

    $.post({
      url: apiUrl,
      contentType: "application/json",
      data: JSON.stringify(newTodo),
      success: function (todo) {
        renderTodo(todo);
        $(".js--form__input").val("");
      },
      error: function () {
        console.error("Failed to add todo");
      },
    });
  }

  function renderTodo(todo) {
    const li = $("<li></li>")
      .addClass(`todo-item ${todo.completed ? "todo-item--checked" : ""}`)
      .attr("data-id", todo._id);

    const checkbox = $("<input>")
      .attr("type", "checkbox")
      .prop("checked", todo.completed)
      .on("change", function () {
        todo.completed = $(this).prop("checked");
        updateTodo(todo);
        li.toggleClass("todo-item--checked", todo.completed);
      });

    const span = $("<span></span>")
      .addClass("todo-item__description")
      .text(todo.text)
      .on("click", function () {
        $("#taskText").text(todo.text);
        $("#taskModal").modal("show");
      });

    const button = $("<button></button>")
      .addClass("todo-item__delete btn btn-danger")
      .text("Видалити")
      .on("click", function () {
        deleteTodo(todo._id);
        li.remove();
      });

    li.append(checkbox, span, button);
    $(".js--todos-wrapper").append(li);
  }

  function updateTodo(todo) {
    $.ajax({
      url: `${apiUrl}/${todo._id}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(todo),
      success: function () {
        console.log("Todo updated");
      },
      error: function () {
        console.error("Failed to update todo");
      },
    });
  }

  function deleteTodo(id) {
    $.ajax({
      url: `${apiUrl}/${id}`,
      type: "DELETE",
      success: function () {
        console.log("Todo deleted");
      },
      error: function () {
        console.error("Failed to delete todo");
      },
    });
  }
});
