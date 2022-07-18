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
    this.el = el;
    mainWrap.addEventListener("click", (e) => {
      let isClicked;
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
        ).then(() => {
          this.getTodos();
        });
        formInput.value = "";
      } else if (eventTarget.classList.contains("set-status")) {
        if (eventTarget.parentElement.classList.contains("in-progress")) {
          isClicked = true;
        } else {
          isClicked = false;
        }

        this.changeStatus(eventTarget.parentElement.dataset.id, isClicked);
      }
    });
  }

  getTodos() {
    getJSON("http://localhost:3000/todos")
      .then((data) => {
        this.render(data);
      })
      .catch((err) => console.log(err));
  }

  changeStatus(id, status) {
    putJSON(
      `http://localhost:3000/todos/${id}`,
      JSON.stringify({
        complited: status,
      })
    ).then(() => {
      this.getTodos();
    });
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

document.addEventListener("onLoad", todo.getTodos());
