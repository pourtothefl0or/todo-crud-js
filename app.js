// CRUD
// Create - POST
// Read - GET
// Update - PUT, PATCH
// Delete - DELETE

// HTTP

const addTodoField = document.querySelector("#field-add-todo");
const addTodoBtn = document.querySelector("#btn-add-todo");
const todoList = document.querySelector(".todo-list");

const API = {
  BASE_URL: "https://jsonplaceholder.typicode.com",
  TODOS_LIMIT: "/todos?_limit=10",
  TODOS: "/todos",
};

async function addTodoToHTML({ id, completed, title }) {
  const isCompleted = completed && "checked";

  todoList.insertAdjacentHTML(
    "beforeend",
    `
    <div class="form-check p-0" id="todo${id}">
      <label class="form-check__label">
        <input type="checkbox" class="form-check__input" ${isCompleted} onchange={toggleCompletedTodo(${id})} />
        ${title}
      </label>
      <button type="button" class="btn-close" aria-label="Delete todo" onclick={deleteTodo(${id})}></button>
    </div>
  `
  );
}

async function getAllTodos() {
  try {
    const request = await fetch(`${API.BASE_URL}${API.TODOS_LIMIT}`);
    const todos = await request.json();

    todos.forEach((todo) => addTodoToHTML(todo));

    console.log("GET: ", todos);
  } catch (error) {
    console.error(error);
  }
}

async function addTodo() {
  const title = addTodoField.value;

  if (!title) return;

  try {
    const request = await fetch(`${API.BASE_URL}${API.TODOS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        completed: false,
      }),
    });
    const todo = await request.json();

    addTodoToHTML(todo);
    addTodoField.value = "";

    console.log("POST: ", todo);
  } catch (error) {
    console.error(error);
  }
}

async function deleteTodo(id) {
  try {
    const request = await fetch(`${API.BASE_URL}${API.TODOS}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();

    if (data) {
      document.querySelector(`#todo${id}`).remove();

      console.log("DELETE: ", data);
    }
  } catch (error) {
    console.log(error);
  }
}

async function toggleCompletedTodo(id) {
  const completed = document.querySelector(`#todo${id} input`).checked;

  try {
    const request = await fetch(`${API.BASE_URL}${API.TODOS}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed,
      }),
    });
    const data = await request.json();

    console.log("PATCH: ", data);
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("DOMContentLoaded", getAllTodos);
addTodoBtn.addEventListener("click", addTodo);
