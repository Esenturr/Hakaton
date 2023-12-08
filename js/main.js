const API = "http://localhost:8000/products";
let inpName = document.getElementById("input_name");
let inpState = document.querySelector("#input_state");
let inpImage = document.querySelector("#input_image");
let inpPrice = document.querySelector("#input_price");
let btnAdd = document.querySelector("#add_button");
let card_section = document.querySelector(".card_section");

let searchValue = ""; // добавьте значение по умолчанию или получите его из другого источника
let currentPage = 1; // добавьте значение по умолчанию или получите его из другого источника
let sectionProducts = document.querySelector("#sectionProducts"); // замените #sectionProducts на селектор вашего элемента

btnAdd.addEventListener("click", async () => {
  if (
    !inpName.value.trim() ||
    !inpState.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }

  let newProduct = {
    productName: inpName.value,
    productState: inpState.value,
    productImage: inpImage.value,
    productPrice: inpPrice.value,
  };
  await create(newProduct);
  await read();
});

// async function create(product) {
//   let res =

//   fetch(API, {
//     method: "POST",
//     headers: {
//       "Content-type": "application/json; charset=utf-8",
//     },
//     body: JSON.stringify(product),
//   });
//   inpName.value = "";+
//   inpState.value = "";
//   inpImage.value = "";
//   inpPrice.value = "";
//   read();
// }
async function create(product) {
  try {
    let res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    inpName.value = "";
    inpState.value = "";
    inpImage.value = "";
    inpPrice.value = "";

    // Дождитесь, пока функция read завершит свою работу, прежде чем выполнить дальнейшие действия
    await read();
  } catch (error) {
    console.error("Error in create:", error);
  }
}

async function read() {
  try {
    const response = await fetch(`${API}?_limit=3`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    card_section.innerHTML = "";
    data.forEach((item) => {
      card_section.innerHTML += `
        <div class="card">
          <img alt="" id="${item.id}" src="${item.productImage}" class="card__image" itemprop="image">
          <span class="card__name" itemprop="name">${item.productName}</span>
          <div class="card__price" itemscope="" itemprop="offers" itemtype="http://schema.org/Offer">
            <span class="card__price-price" itemprop="price">${item.productPrice}</span>
            <span class="card__price-currency">сом</span>
          </div>
          <div>
            <button class="btn btn-outline-danger btnDelete" id="${item.id}">Удалить</button>
            <button class="btnEdit" id="${item.id}">Изменить</button>
          </div>
          <div class="card__status">${item.productState}</div>
        </div>
      `;
    });
    // pageFunc();
  } catch (error) {
    console.error("Error in read:", error);
  }
}

read();

//! delete
document.addEventListener("click", (e) => {
  try {
    let del_class = [...e.target.classList];
    if (del_class.includes("btnDelete")) {
      let del_id = e.target.id;
      fetch(`${API}/${del_id}`, {
        method: "DELETE",
      }).then(() => read());
    }
  } catch (err) {
    console.log(err);
  }
});
// !0--------edit
let editInpName = document.querySelector("#editInpName");
let editInpState = document.querySelector("#editInpState");
let editInpImage = document.querySelector("#editInpImage");
let editInpPrice = document.querySelector("#editInpPrice");
let editBtnSave = document.querySelector("#editBtnSave");
document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        editInpName.value = data.productName;
        editInpState.value = data.productState;
        editInpImage.value = data.productImage;
        editInpPrice.value = data.productPrice;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});
editBtnSave.addEventListener("click", () => {
  let editedProduct = {
    productName: editInpName.value,
    productState: editInpState.value,
    productImage: editInpImage.value,
    productPrice: editInpPrice.value,
  };
  edit(editedProduct, editBtnSave.id);
});

function edit(editedProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct), // Fix here: use editedProduct instead of editProduct
  }).then(() => read());
}
