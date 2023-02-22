const API = "http://localhost:8000/contact";

let title = document.querySelector("#title");
let prise = document.querySelector("#price");
let descr = document.querySelector("#descr");
let image = document.querySelector("#image");
let email = document.querySelector("#email");
let btnAdd = document.querySelector("#btn-add");
const list = document.querySelector(".list-group");

btnAdd.addEventListener("click", async function () {
  let obj = {
    title: title.value,
    prise: prise.value,
    descr: descr.value,
    image: image.value,
    email: email.value,
  };

  if (
    !obj.title.trim() ||
    !obj.prise.trim() ||
    !obj.descr.trim() ||
    !obj.image.trim() ||
    !obj.email.trim()
  ) {
    alert("заполните все поля!");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  title.value = "";
  prise.value = "";
  descr.value = "";
  image.value = "";
  email.value = "";
  getTodos();
});

async function getTodos() {
  try {
    let res = await fetch(API);
    let todos = await res.json();
    render(todos);
  } catch (error) {
    console.log(error);
  }
}

function render(todos) {
  list.innerHTML = "";
  todos.forEach((item) => {
    list.innerHTML += `
    <div class="listt">
    <li class="list-group-item">
      <p> Name: ${item.title}</p>
    </li>
    <li class="list-group-item">
      <p> Surname: ${item.prise}</p>
    </li>
    <li class="list-group-item">
      <img src=${item.image} alt="">
    </li>
    <li class="list-group-item">
      <p> Number: ${item.descr}</p>
    </li>
    <li class="list-group-item">
      <p> Email: ${item.email}</p>
    </li>
    <li class="list-group-item">
      <button onclick="deleteTodo(${item.id})" class="btn btn-outline-danger">delete</button>
      <button onclick="editTodo(${item.id})" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">edit</button>
    </li>
    </div>
  `;
  });
}

getTodos();

async function deleteTodo(id) {
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    getTodos();
  } catch (error) {
    console.log(error);
  }
}

//? edit

let inpEdit = document.querySelector(".inp-edit");
let inpEdit1 = document.querySelector(".inp-edit1");
let inpEdit2 = document.querySelector(".inp-edit2");
let inpEdit3 = document.querySelector(".inp-edit3");
let inpEdit4 = document.querySelector(".inp-edit4");
let saveBtn = document.querySelector(".save-btn");
let editModal = document.querySelector("#exampleModal");

let editedObj = {};

inpEdit.addEventListener("input", (e) => {
  editedObj.title = e.target.value;
});
inpEdit1.addEventListener("input", (e) => {
  editedObj.prise = e.target.value;
});
inpEdit2.addEventListener("input", (e) => {
  editedObj.descr = e.target.value;
});
inpEdit3.addEventListener("input", (e) => {
  editedObj.image = e.target.value;
});
inpEdit4.addEventListener("input", (e) => {
  editedObj.email = e.target.value;
});

async function editTodo(id) {
  try {
    let res = await fetch(`${API}/${id}`);
    let objToEdit = await res.json();
    inpEdit.value = objToEdit.title;
    inpEdit1.value = objToEdit.prise;
    inpEdit2.value = objToEdit.descr;
    inpEdit3.value = objToEdit.image;
    inpEdit4.value = objToEdit.email;
    saveBtn.setAttribute("id", `${id}`);
  } catch (error) {
    console.log(error);
  }
}

saveBtn.addEventListener("click", async (e) => {
  let id = e.target.id;
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editedObj),
    });
  } catch (error) {
    console.log(error);
  }
  getTodos();
  let modal = bootstrap.Modal.getInstance(editModal);
  modal.hide();
  editedObj = {};
});
