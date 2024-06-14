import { afficherTravaux, filtrerTravaux } from "./functions.js";

const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();
const worksZone = document.querySelector(".gallery");
const filterList = document.querySelectorAll("#filter li");
// console.log(filterList);
// console.log(works);


afficherTravaux(works, worksZone);

filtrerTravaux(filterList,works,worksZone);