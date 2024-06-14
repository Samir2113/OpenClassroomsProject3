export function afficherTravaux(worksList, galleryZone){
    galleryZone.innerHTML = "";
    for(let i=0; i<worksList.length; i++){
        let work = `
                    <figure>
                        <img src=${worksList[i].imageUrl} alt=${worksList[i].title}>
                        <figcaption>${worksList[i].title}</figcaption>
                    </figure>`;
        
        galleryZone.innerHTML += work;
    }
}


export function filtrerTravaux(categories, worksList, galleryZone){
    
    for(let i=0; i<categories.length; i++){
        categories[i].addEventListener('click',(e)=>{
            categories.forEach(element => {
                element.classList.remove("selected");
            });
            let newWorksList = worksList;
            if(i != 0){
                newWorksList = worksList.filter((work)=>{
                    return work.categoryId === i;
                });
            }
            afficherTravaux(newWorksList,galleryZone);
            e.currentTarget.classList.add("selected");
        });        
    }    
}

