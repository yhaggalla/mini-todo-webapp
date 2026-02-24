const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const clearDoneBtn = document.getElementById("clearDone");
const clearAllBtn = document.getElementById("clearAll");

const STORAGE_KEY = "miniTodoItems";

let todos = loadTodos();
render();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.unshift({
    id: crypto.randomUUID(),
    text,
    done: false
  });

  input.value = "";
  saveTodos();
  render();
});

clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.done);
  saveTodos();
  render();
});

clearAllBtn.addEventListener("click", () => {
  todos = [];
  saveTodos();
  render();
});

function toggleDone(id) {
  todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  render();
}

function render() {
  list.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "item";
    empty.innerHTML = `<span class="text">No tasks yet. Add one above 👆</span>`;
    list.appendChild(empty);
    return;
  }

  for (const t of todos) {
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " done" : "");

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = t.text;
    span.addEventListener("click", () => toggleDone(t.id));

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "Delete";
    del.addEventListener("click", () => deleteTodo(t.id));

    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
