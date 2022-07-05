const getJSON = function (url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.open("get", url, true);
    xhr.responseType = "json";

    xhr.onload = function () {
      let status = xhr.status;

      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.onerror = function () {
      reject("Error fetching " + url);
    };
    xhr.send();
  });
};

const postJSON = function (url, data) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.open("post", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

    xhr.responseType = "json";

    xhr.onload = function () {
      let status = xhr.status;
      if (status === 201 || status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };

    xhr.onerror = function () {
      reject("Error fetching " + url);
    };
    xhr.send(data);
  });
};

const putJSON = function (url, data) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

    xhr.responseType = "json";

    xhr.onload = function () {
      let status = xhr.status;

      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.onerror = function () {
      reject("Error fetching " + url);
    };
    xhr.send(data);
  });
};

const formInput = document.querySelector(".add-task__input");
const mainWrap = document.querySelector(".main-wrap");
const list = document.querySelector("#list");

class TodoList {
  constructor(el) {
    this.todos = [];
    this.el = el;
    mainWrap.addEventListener("click", (e) => {
      let fieldValue = formInput.value;
      const eventTarget = e.target;
      if (eventTarget.classList.contains("add-task__button")) {
        if (fieldValue === "") return;
        postJSON(
          "http://localhost:3000/todos",
          JSON.stringify({
            task: fieldValue,
            complited: false,
          })
        ).then((data) => {
          todo.addTodo(data);
          todo.render(this.todos);
        });
        todo.render(this.todos);
        formInput.value = "";
      } else if (eventTarget.classList.contains("delete-task")) {
        todo.removeTodo(eventTarget.parentElement.dataset.id);
        eventTarget.closest("li").remove();
      } else if (eventTarget.id === "add-task__button_search") {
        todo.findTask(fieldValue);
      } else if (eventTarget.classList.contains("set-status")) {
        todo.changeStatus(eventTarget.parentElement.dataset.id);
      }
    });
  }
  addTodo(todo) {
    this.todos.push(todo);
  }

  getTodos() {
    getJSON("http://localhost:3000/todos")
      .then((data) => {
        data.map((el) => {
          this.addTodo(el);
        });
        this.render(this.todos);
      })
      .catch((err) => console.log(err));
  }

  removeTodo(id) {
    this.todos = this.todos.filter((el) => {
      return el.id !== id;
    });
  }

  changeStatus(id) {
    let index = this.todos.findIndex((el) => el.id == id);
    this.todos[index].complited = !this.todos[index].complited;
    putJSON(
      `http://localhost:3000/todos/${id}`,
      JSON.stringify({
        complited: this.todos[index].complited ? true : false,
      })
    ).catch((err) => console.log(err));
    this.render(this.todos);
  }

  findTask(params) {
    this.render(
      this.todos.filter((item) => {
        console.log(item);
        return item.task.includes(params);
      })
    );
  }

  render(render = []) {
    let lis = "";
    for (let el of render) {
      if (!el) {
        return;
      }
      lis += `
        <li data-id="${el.id}" class ="${
        el.complited ? "done" : "in-progress"
      } list__li">
          ${el.task}
         <button class="set-status">Change status</button>
         <button class="delete-task">Delete</button>
        </li>
      `;
    }
    this.el.innerHTML = lis;
  }
}

let todo = new TodoList(list);
document.addEventListener("load", todo.getTodos());
