import {
  afficherTravaux,
  displaySwitch,
  isConnected,
  openModal,
  setCategories,
  logout,
} from "./functions.js";
export {
  reponseWorks,
  works,
  workCategories,
  logoutLink,
  worksZone,
  worksEditZone,
  filteredList,
  modal,
  setModal,
};

const reponseWorks = await fetch("http://localhost:5678/api/works");
const works = await reponseWorks.json();
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const workCategories = await reponseCategories.json();
const logoutLink = document.querySelector("#login");
let connected = isConnected();
const worksZone = document.querySelector(".gallery");
const worksEditZone = document.querySelector(".list-photo-edit");
const filterList = document.querySelectorAll("#filter li");
let filteredList = "";
const formCateInput = document.querySelector("#categoryId");
let modal = null;
function setModal(value) {
  modal = value;
}

displaySwitch(connected);

afficherTravaux(works, worksZone, modal);

/// Partie Filtre ///
filterList.forEach((categorie) => {
  categorie.addEventListener("click", (e) => {
    Array.from(filterList).map((item) => {
      item.classList.remove("selected");
    });
    const clickedBtn = e.target;
    if (clickedBtn.textContent === "Tous") {
      clickedBtn.classList.add("selected");
      filteredList = works;
    } else {
      clickedBtn.classList.add("selected");
      filteredList = works.filter((work) => {
        return work.category.name === clickedBtn.textContent;
      });
    }
    afficherTravaux(filteredList, worksZone, modal);
  });
});

setCategories(formCateInput, workCategories);

document.querySelector(".js-modal").addEventListener("click", (event) => {
  event.stopPropagation;
  openModal(event);
});

logoutLink.addEventListener("click", (e) => {
  if (isConnected()) {
    e.preventDefault();
    logout();
  }
});
