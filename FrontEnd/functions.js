import { reponseWorks, modal, works, setModal,worksZone, worksEditZone } from "./main.js";
export {afficherTravaux, filtrerTravaux, displaySwitch, isConnected, openModal,deleteProject, setCategories}


function afficherTravaux(worksList, galleryZone, modalState){
    galleryZone.innerHTML = "";
    let deleteIcon = "";
    let figcaption = "";
    // Les différents tests sont effectués pour différencier l'affichage  
    // des travaux dans la section projets et ceux de la modal
    if(modalState !== null){
        deleteIcon =  `<i class="fa-solid fa-trash-can" style="color: #FFFFFF;"></i>`;
    }
    for(let i=0; i<worksList.length; i++){
        if(modalState === null){
            figcaption = `<figcaption>${worksList[i].title}</figcaption>`;
        }
        let work = `<figure data-id="${worksList[i].id}">
                        ${deleteIcon}
                        <img src=${worksList[i].imageUrl} alt=${worksList[i].title}>
                        ${figcaption}
                    </figure>`;
        
        galleryZone.innerHTML += work;
    }
}


function filtrerTravaux(categories, worksList, galleryZone){
    
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

function displaySwitch(inputMode){
    console.log(inputMode);
    if(inputMode === true){
        document.getElementById("editBanner").style.display = 'flex';
        document.getElementById("filter").style.display = 'none';
        document.getElementById("portfolio").style.display = "flex";
        document.querySelector("#portfolio> h2").style.paddingBottom = `2em`;
        document.querySelector("#portfolio> h2").style.textAlign = `end`;
        document.querySelector("#portfolio> h2").style.paddingRight = `30px`;
        document.querySelector("#portfolio> h2").style.width = `60%`;
        document.getElementById("editProjects").style.display = "flex";
    }else{
        console.log(document.getElementById("editBanner"));
        document.getElementById("editBanner").style.display = 'none';
        document.getElementById("filter").style.display = '';
        document.getElementById("portfolio").style.flexWrap = "nowrap";
        document.getElementById("portfolio").style.display = "inline-bloc";
        document.getElementById("editProjects").style.display = "none";
    }
}



function isConnected(){
    if(sessionStorage.getItem("token")){
        return true;
    }else{
        return false;
    }
}

const openModal = function(e){
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    const closeBtn = document.querySelector('.fa-xmark');
    const modalWrapper = document.querySelector('.modal-wrapper');
    const body = document.querySelector('body');
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    setModal(target);
    afficherTravaux(works,worksEditZone, modal);

    //Suppression 
    let test = document.querySelectorAll('.list-photo-edit .fa-trash-can');
    console.log([test]);
    test.forEach(async itemm => {
        
        itemm.addEventListener('click', async () => {
            

            const idProject = itemm.parentElement.dataset.id;
            console.log(itemm);
            console.log(idProject);
            await fetch(`http://localhost:5678/api/works/${idProject}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
           
        //     test = document.querySelector('.list-photo-edit');
        })
         // Ici on rafraichit la modal
         const worksMajReponse = await fetch("http://localhost:5678/api/works");
         const worksMaj = await worksMajReponse.json(); 
         afficherTravaux(worksMaj,worksEditZone, modal);
    })
    
    //Ajout projet
    const addImgBtn = document.querySelector("#addImgBtn");
    addImgBtn.addEventListener('click', ()=>{
        const modalWrapper = document.querySelector('.modal-wrapper');
        const modalElmts = modalWrapper.children;
        let modalElmtsArray = Array.from(modalElmts);
        modalElmtsArray.forEach((item)=>{
            let itemClassList = Array.from(item.classList);
            if(itemClassList.includes('supp-form')){
                item.style.display = "none";
                modalWrapper.classList.add('modal-wrapper-2')
            }else{
                item.style.display = null;
            }
        });
        // const addProjectsForm = document.querySelector('.projects-add-form form');
        const validateFormBtn = document.querySelector('#validateBtn');
        validateFormBtn.addEventListener('click', async(e)=>{
            const imgUrl = document.querySelector("#imageUrl").files[0];
            const title = document.querySelector("#title").value;
            const category = document.querySelector("#categoryId").value;
            
            const formInputs = new FormData();
            formInputs.append("image", imgUrl)
            formInputs.append("title", title);
            formInputs.append("category", category);
            console.log(Object.fromEntries(formInputs));
            // let objTest = {
            //     imageUrl:'D:\\Documents\\Projet3 OC\\Portfolio-architecte-sophie-bluel-master\\FrontEnd\\assets\\images\\structures-thermopolis.png',
            //     title:'Structures Thermopolis',
            //     categoryId:1
            // }
            await fetch("http://localhost:5678/api/works", {
                method: "POST",
                body: formInputs,
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                }               
           }).then(res => res.json()).then(data=>console.log(data)).catch(err=>console.log(err))
        });
    });

    modal.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    modal.querySelector('.modal-wrapper').addEventListener('click', stopPropagation);
}

const closeModal = function(e){
    if(modal === null) return
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.querySelector('.modal-wrapper').removeEventListener('click', stopPropagation);
    setModal(null);
}

const stopPropagation = function(e){
    e.stopPropagation();
}

const deleteProject = async function(e){
    console.log('hello');
    console.log('e: '+ e);
    console.log(e.target);
    const projectId = e.target.parentNode.dataset.id;
    
    let myToken = sessionStorage.getItem('token');
    console.log(myToken);
    const reponseDelWork = await fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
    });
    const delWork = reponseDelWork.json();
    console.log(`Réponse status: ${delWork.status}` );

}

const setCategories = function(inputArea, categorieList){  
    categorieList.map((cat)=>{
        let cateOption = document.createElement('option');
        cateOption.setAttribute("value", cat.id)
        cateOption.textContent = cat.name
        inputArea.appendChild(cateOption); 
    })
} 


