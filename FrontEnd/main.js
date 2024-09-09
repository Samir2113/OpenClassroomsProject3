import { afficherTravaux, displaySwitch, filtrerTravaux, isConnected, openModal, setCategories} from "./functions.js";
export {reponseWorks, works, workCategories, worksZone, worksEditZone, modal, setModal}


const reponseWorks = await fetch("http://localhost:5678/api/works"); 
const works = await reponseWorks.json();
const reponseCategories = await fetch("http://localhost:5678/api/categories"); 
const workCategories = await reponseCategories.json();
console.log(workCategories);

let connected = isConnected();
const worksZone = document.querySelector(".gallery");
const worksEditZone = document.querySelector(".list-photo-edit");
const filterList = document.querySelectorAll("#filter li");
const formCatInput = document.querySelector('#categoryId');
let modal = null;
function setModal(value){
    modal = value;
}

displaySwitch(connected);

afficherTravaux(works, worksZone, modal);

filtrerTravaux(filterList,works,worksZone);

setCategories(formCatInput, workCategories);

document.querySelector('.js-modal').addEventListener('click', (event) => {
    event.stopPropagation;
    console.log(event);
    openModal(event);
});


