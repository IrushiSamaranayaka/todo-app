let currentFilter = "all";

function saveTasks() {
  let tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      name: li.querySelector(".task-name").textContent,
      time: li.querySelector(".task-time").textContent,
      dueDate: li.querySelector(".due-date") ? li.querySelector(".due-date").textContent : "",
      completed: li.querySelector(".task-text").classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount() {
  let totalTasks = document.querySelectorAll("#taskList li").length;
  document.getElementById("taskCount").textContent = "Total Tasks: " + totalTasks;

  let emptyMessage = document.getElementById("emptyMessage");
  emptyMessage.style.display = totalTasks === 0 ? "block" : "none";
}

function formatDueDateText(dueDateValue) {
  if (!dueDateValue) return "";

  let today = new Date();
  let dueDate = new Date(dueDateValue);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return "Due: " + dueDateValue + " (Overdue)";
  } else {
    return "Due: " + dueDateValue;
  }
}

function createTaskElement(taskText, taskTimeText = null, isCompleted = false, dueDateValue = "") {
  let li = document.createElement("li");

  let taskContent = document.createElement("div");
  taskContent.className = "task-text";

  if (isCompleted) {
    taskContent.classList.add("completed");
  }

  let taskName = document.createElement("span");
  taskName.className = "task-name";
  taskName.textContent = taskText;

  let taskTime = document.createElement("small");
  taskTime.className = "task-time";
  taskTime.textContent = taskTimeText || "Added: " + new Date().toLocaleString();

  taskContent.appendChild(taskName);
  taskContent.appendChild(taskTime);

  if (dueDateValue) {
    let dueDate = document.createElement("small");
    dueDate.className = "due-date";
    dueDate.textContent = formatDueDateText(dueDateValue);

    if (dueDate.textContent.includes("Overdue")) {
      dueDate.classList.add("overdue");
    }

    taskContent.appendChild(dueDate);
  }

  taskContent.onclick = function () {
    taskContent.classList.toggle("completed");
    saveTasks();
    filterTasks(currentFilter);
  };

  let buttonGroup = document.createElement("div");
  buttonGroup.className = "task-buttons";

  let editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "edit-btn";

  editButton.onclick = function () {
    let newTask = prompt("Edit your task:", taskName.textContent);
    if (newTask !== null && newTask.trim() !== "") {
      taskName.textContent = newTask.trim();
      saveTasks();
    }
  };

  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-btn";

  deleteButton.onclick = function () {
    li.remove();
    updateTaskCount();
    saveTasks();
  };

  buttonGroup.appendChild(editButton);
  buttonGroup.appendChild(deleteButton);

  li.appendChild(taskContent);
  li.appendChild(buttonGroup);

  document.getElementById("taskList").appendChild(li);
}

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let dueDateInput = document.getElementById("dueDateInput");

  let taskText = taskInput.value.trim();
  let dueDateValue = dueDateInput.value;

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  createTaskElement(taskText, null, false, dueDateValue);

  taskInput.value = "";
  dueDateInput.value = "";

  updateTaskCount();
  saveTasks();
  filterTasks(currentFilter);
}

function clearAllTasks() {
  document.getElementById("taskList").innerHTML = "";
  updateTaskCount();
  saveTasks();
}

function filterTasks(type) {
  currentFilter = type;
  let allTasks = document.querySelectorAll("#taskList li");

  allTasks.forEach(li => {
    let isCompleted = li.querySelector(".task-text").classList.contains("completed");

    if (type === "all") {
      li.style.display = "flex";
    } else if (type === "pending") {
      li.style.display = isCompleted ? "none" : "flex";
    } else if (type === "completed") {
      li.style.display = isCompleted ? "flex" : "none";
    }
  });
}

function loadTasks() {
  let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach(task => {
    let cleanDueDate = "";

    if (task.dueDate) {
      cleanDueDate = task.dueDate.replace("Due: ", "").replace(" (Overdue)", "");
    }

    createTaskElement(task.name, task.time, task.completed, cleanDueDate);
  });

  updateTaskCount();
  filterTasks("all");
}

document.getElementById("taskInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

loadTasks();
function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  let isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");

  document.getElementById("themeToggleBtn").textContent = isDarkMode ? "Light Mode" : "Dark Mode";
}

function loadTheme() {
  let savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("themeToggleBtn").textContent = "Light Mode";
  }
}

loadTheme();