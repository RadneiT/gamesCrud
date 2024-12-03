const addBtn = document.querySelector("#addBtn"),
  modalContainer = document.querySelector(".modal-container"),
  modalForm = document.querySelector(".modal"),
  closeBtn = document.querySelector(".closeBtn"),
  submitBtn = document.querySelector("submitBtn"),
  form = document.querySelector("#formRegister"),
  obtInput = document.querySelector("#obtInput"),
  nameInput = document.querySelector("#nameInput"),
  priceInput = document.querySelector("#priceInput"),
  platformInput = document.querySelector("#platformInput"),
  priorityInput = document.querySelector("#priorityInput"),
  avaiInput = document.querySelector("#avaiInput"),
  tableBody = document.querySelector("#tableBody"),
  searchBar = document.querySelector(".input-group input"),
  table_headings = document.querySelectorAll("thead .sortable");

let gameData = JSON.parse(localStorage.getItem("formData")) || [];

addBtn.addEventListener("click", () => {
  modalContainer.classList.add("modal-active");
  modalForm.classList.add("modal-active");
});

closeBtn.addEventListener("click", () => {
  modalContainer.classList.remove("modal-active");
  modalForm.classList.remove("modal-active");
  form.reset();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const obtained = obtInput.value;
  const name = nameInput.value;
  const price = priceInput.value;
  const platform = platformInput.value;
  const priority = priorityInput.value;
  const available = avaiInput.value;

  if (obtained && name && price && platform && priority && available) {
    const newData = { obtained, name, price, platform, priority, available };
    gameData.push(newData);
    saveDataToLocalStorage();
    modalContainer.classList.remove("modal-active");
    modalForm.classList.remove("modal-active");
    showData();
    form.reset();
    location.reload();
  }
});

function saveDataToLocalStorage() {
  localStorage.setItem("formData", JSON.stringify(gameData));
}

function showData() {
  tableBody.innerHTML = "";

  gameData.forEach(function (item, index) {
    let row = `<tr>
              <td>${item.obtained}</td>
              <td>${item.name}</td>
              <td>${item.price}</td>
              <td>${item.platform}</td>
              <td>
                <p class="status ${item.priority}">${item.priority}</p>
              </td>
              <td>${item.available}</td>
              <td>
                <button onclick="editData(${index})" class="button button--secondary">
                  <i class="bx bx-edit"></i>
                </button>
                <button onclick="deleteData(${index})" class="button button--tertiary">
                  <i class="bx bx-trash"></i>
                </button>
              </td>
            </tr>`;
    tableBody.innerHTML += row;
  });
}

function editData(index) {
  const item = gameData[index];
  modalContainer.classList.add("modal-active");
  modalForm.classList.add("modal-active");

  obtInput.value = item.obtained;
  nameInput.value = item.name;
  priceInput.value = item.price;
  platformInput.value = item.platform;
  priorityInput.value = item.priority;
  avaiInput.value = item.available;

  gameData.splice(index, 1);

  saveDataToLocalStorage();
  showData();
}

function deleteData(index) {
  gameData.splice(index, 1);

  saveDataToLocalStorage();
  location.reload();
  showData();
}

showData();

const table_rows = document.querySelectorAll("tbody tr");

// FILTER DATA
searchBar.addEventListener("input", searchTable);

function searchTable() {
  table_rows.forEach((row, i) => {
    let table_data = row.textContent.toLowerCase(),
      search_data = searchBar.value.toLowerCase();

    row.classList.toggle("hide", table_data.indexOf(search_data) < 0);
    row.style.setProperty("--delay", i / 25 + "s");
  });

  document.querySelectorAll("tbody tr:not(.hide)").forEach((visible_row, i) => {
    visible_row.style.backgroundColor =
      i % 2 == 0 ? "transparent" : "#0000000b";
  });
}

// SORTING DATA

table_headings.forEach((head, i) => {
  let sort_asc = true;

  head.onclick = () => {
    table_headings.forEach((head) => head.classList.remove("active"));
    head.classList.add("active");

    document
      .querySelectorAll("td")
      .forEach((td) => td.classList.remove("active"));

    // table_rows.forEach((row) => {
    //   row.querySelectorAll("td")[i].classList.add("active");
    // });

    head.classList.toggle("asc", sort_asc);
    sort_asc = head.classList.contains("asc") ? false : true;

    sortTable(i, sort_asc);
  };
});

function sortTable(column, sort_asc) {
  [...table_rows]
    .sort((a, b) => {
      let first_row = a
          .querySelectorAll("td")
          [column].textContent.toLowerCase(),
        second_row = b.querySelectorAll("td")[column].textContent.toLowerCase();

      return sort_asc
        ? first_row < second_row
          ? 1
          : -1
        : first_row < second_row
        ? -1
        : 1;
    })
    .map((sorted_row) => tableBody.appendChild(sorted_row));
}
