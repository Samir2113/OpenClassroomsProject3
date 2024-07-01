import { afficherTravaux, filtrerTravaux } from "./functions.js";

const reponseWorks = await fetch("http://localhost:5678/api/works");
const works = await reponseWorks.json();
const logins = {
    "email": "sophie.bluel@test.tld",
    "password": "S0phie"
};
const requestLogin = JSON.stringify(logins);
const reponseLogin = await fetch("http://localhost:5678/api/users/login",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: requestLogin
});
const test = await reponseLogin.json();
console.log(reponseLogin.status);
console.log(test);
window.sessionStorage.setItem('tokenName',test.token);

// test.then(({token, userId}) => console.log({token, userId}));

const worksZone = document.querySelector(".gallery");
const filterList = document.querySelectorAll("#filter li");
// console.log(filterList);



afficherTravaux(works, worksZone);

filtrerTravaux(filterList,works,worksZone);