import { modal, setModal, logoutLink, worksZone, worksEditZone } from "./main.js";
export {
  afficherTravaux,
  displaySwitch,
  isConnected,
  openModal,
  deleteProject,
  setCategories,
  logout,
};
const modalWrapper = document.querySelector(".modal-wrapper");
const imgUrl = document.querySelector("#imageUrl");
const title = document.querySelector("#title");
const category = document.querySelector("#categoryId");
const inputs = [imgUrl, title, category];
const validateFormBtn = document.querySelector("#validateBtn");
let validForm = false;
let trashList = document.querySelectorAll(".list-photo-edit .fa-trash-can");


function afficherTravaux(workss, galleryZone, modalState) {
  // Les différents tests sont effectués pour différencier l'affichage
  // des travaux dans la section projets et ceux de la modal
  Array.from(galleryZone.children).map((item) => {
    item.remove();
  });

  let deleteIcon = document.createElement("i");
  deleteIcon.className = "fa-solid fa-trash-can";
  deleteIcon.setAttribute("style", "color: #FFFFFF;");

  for (let i = 0; i < workss.length; i++) {
    let work = document.createElement("figure");
    let imgWork = document.createElement("img");
    work.setAttribute("data-id", workss[i].id);
    imgWork.src = workss[i].imageUrl;
    imgWork.alt = workss[i].title;
    work.appendChild(imgWork);

    if (modalState === null) {
      let figcaption = document.createElement("figcaption");
      figcaption.textContent = workss[i].title;
      work.appendChild(figcaption);
    } else {
      work.prepend(deleteIcon.cloneNode());
    }
    galleryZone.appendChild(work);
  }
  //Suppression de projets
  trashList = document.querySelectorAll(".list-photo-edit .fa-trash-can");
  trashList.forEach(async (itemm) => {
    deleteProject(itemm);
  });
}

function displaySwitch(inputMode) {
  if (inputMode === true) {
    document.getElementById("editBanner").style.display = "flex";
    logoutLink.textContent = "logout";
    document.getElementById("filter").style.display = "none";
    document.getElementById("portfolio").style.display = "flex";
    document.querySelector("#portfolio> h2").style.paddingBottom = `2em`;
    document.querySelector("#portfolio> h2").style.textAlign = `end`;
    document.querySelector("#portfolio> h2").style.paddingRight = `30px`;
    document.querySelector("#portfolio> h2").style.width = `60%`;
    document.getElementById("editProjects").style.display = "flex";
  } else {
    document.getElementById("editBanner").style.display = "none";
    document.getElementById("filter").style.display = "";
    document.getElementById("portfolio").style.flexWrap = "nowrap";
    document.getElementById("portfolio").style.display = "inline-bloc";
    document.getElementById("editProjects").style.display = "none";
  }
}

function isConnected() {
  if (sessionStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
}

const openModal = async function (e) {
  const reponseWorks = await fetch("http://localhost:5678/api/works");
  const works = await reponseWorks.json();
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  const closeBtn = document.querySelector(".fa-xmark");
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  setModal(target);
  afficherTravaux(works, worksEditZone, modal);
  modal.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  modal
    .querySelector(".modal-wrapper")
    .addEventListener("click", stopPropagation);
};

// liste les catégories du formulaire
const setCategories = function (inputArea, categorieList) {
  categorieList.map((cat) => {
    let cateOption = document.createElement("option");
    cateOption.setAttribute("value", cat.id);
    cateOption.textContent = cat.name;
    inputArea.appendChild(cateOption);
  });
};

//Ajout de projets
const addImgBtn = document.querySelector("#addImgBtn");
addImgBtn.addEventListener("click", () => {
  const modalElmts = modalWrapper.children;
  let modalElmtsArray = Array.from(modalElmts);
  modalElmtsArray.forEach((item) => {
    let itemClassList = Array.from(item.classList);
    if (itemClassList.includes("supp-form")) {
      item.style.display = "none";
    } else {
      item.style.display = null;
    }
  });
  modalWrapper.classList.add("modal-wrapper-2");

  //Preview image
  inputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const focusedInput = e.target;
      const addImgZone = document.querySelector(".add-img");
      if (focusedInput.id === "imageUrl" && focusedInput.files[0]) {
        for (const item of addImgZone.children) {
          if (item.id === "img-preview") {
            const fileReader = new FileReader();
            fileReader.onload = () => {
              item.setAttribute("src", fileReader.result);
            };
            fileReader.readAsDataURL(focusedInput.files[0]);
            item.setAttribute("style", "display: null");
          } else {
            item.setAttribute("style", "display: none");
          }
        }
      } else if (!inputs[0].files[0]) {
        for (const item of addImgZone.children) {
          if (item.id === "img-preview" || item.id === "imageUrl") {
            item.setAttribute("style", "display: none");
          } else {
            item.setAttribute("style", "display: null");
          }
        }
      }

      /// Vérification Validité Formulaire ///
      for (const input of inputs) {
        if (input.value.trim() == "") {
          validForm = false;
          break;
        }
        validForm = true;
      }
      validForm
        ? validateFormBtn.classList.add("okColor")
        : validateFormBtn.classList.remove("okColor");
    });
  });
  /// Retour à la modal de suppression de projet ///
  const goBackArrowBtn = document.querySelector(".fa-arrow-left");
  goBackArrowBtn.addEventListener("click", () => {
    goBackArrow(modalWrapper, modalElmtsArray);
  });
});

/// Validation du formulaire ///
validateFormBtn.addEventListener("click", async (e) => {
  if (validForm) {
    let formInputs = new FormData();
    formInputs.append("image", imgUrl.files[0]);
    formInputs.append("title", title.value);
    formInputs.append("category", category.value);
    try {
      const reponse = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formInputs,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Probleme: ", error);
    }

    /// Reset formulaire - Refresh WorksPage ///
    validForm = false;
    refreshInputs();
    const reponseWorks = await fetch("http://localhost:5678/api/works");
    const works = await reponseWorks.json();
    afficherTravaux(works, worksZone, null);
  }
});

function refreshInputs() {
  const formImgZone = document.querySelector(".add-img").children;
  const imgPreview = document.querySelector("#img-preview");
  /// RàZ de la "Zone preview" du Formulaire ///
  Array.from(formImgZone).forEach((item) => {
    if (item.id === imgPreview.id || item.type === "file") {
      imgPreview.setAttribute("style", "display: none");
    } else {
      item.setAttribute("style", "display: null");
    }
  });
  /// RàZ des "Inputs" du Formulaire ///
  inputs.forEach((input) => {
    if (input.type === "file") {
      input.value = null;
    } else {
      input.value = "";
      input.setAttribute("style", "display: null");
    }
  });
  validateFormBtn.classList.remove("okColor");
}

const goBackArrow = async function (modalZone, elementList) {
  const reponseWorks = await fetch("http://localhost:5678/api/works");
  const works = await reponseWorks.json();
  elementList.forEach((item) => {
    let itemClassList = Array.from(item.classList);
    if (itemClassList.includes("add-form")) {
      item.style.display = "none";
    } else {
      item.style.display = null;
    }
  });
  modalZone.classList.remove("modal-wrapper-2");
  refreshInputs();
  afficherTravaux(works, worksEditZone, modal);
};

const deleteProject = async function (trashItem) {
  trashItem.addEventListener("click", async (e) => {
    const idProject = e.target.parentElement.dataset.id;
    const rep = await fetch(`http://localhost:5678/api/works/${idProject}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    e.target.parentElement.remove(); // Delete dans la modale
    const reponseWorks = await fetch("http://localhost:5678/api/works");
    const works = await reponseWorks.json();
    afficherTravaux(works, worksZone, null); // MàJ Page en Arrière plan
  });
};

const closeModal = function (e) {
  if (modal === null) {
    return;
  }
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal
    .querySelector(".modal-wrapper")
    .removeEventListener("click", stopPropagation);
  setModal(null);
  refreshInputs();
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

function logout() {
  sessionStorage.setItem("token", "");
  document.location.href = "index.html";
}
