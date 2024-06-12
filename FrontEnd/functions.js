const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();
console.log(works[0]);

const worksElement = document.querySelector(".gallery");

for(let i=0; i<works.length; i++){
    let work = `
                <figure>
                    <img src=${works[i].imageUrl} alt=${works[i].title}>
                    <figcaption>${works[i].title}</figcaption>
                </figure>`;
    
    worksElement.innerHTML += work;
}