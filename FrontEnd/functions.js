import { reponseWorks, modal, works, setModal,worksZone, worksEditZone/*inputs,setImgUrl,setTitle,setCategory*/} from "./main.js";
export {afficherTravaux, filtrerTravaux, displaySwitch, isConnected, openModal,deleteProject, setCategories}
const imgUrl = document.querySelector("#imageUrl");
const title = document.querySelector("#title");
const category = document.querySelector("#categoryId");
const inputs = [imgUrl,title,category];
let trashList = document.querySelectorAll('.list-photo-edit .fa-trash-can');


async function afficherTravaux(galleryZone, modalState){
    // Les différents tests sont effectués pour différencier l'affichage  
    // des travaux dans la section projets et ceux de la modal
    const reponseWorkss = await fetch("http://localhost:5678/api/works");
    const workss = await reponseWorkss.json();
    Array.from(galleryZone.children).map(item=>{
        item.remove()
    });
    
    let deleteIcon = document.createElement('i');
    deleteIcon.className = "fa-solid fa-trash-can";
    deleteIcon.setAttribute('style', "color: #FFFFFF;");
    
    for(let i=0; i<workss.length; i++){
        let work = document.createElement('figure');
        let imgWork = document.createElement('img');
        work.setAttribute("data-id", workss[i].id);
        imgWork.src = workss[i].imageUrl;
        imgWork.alt = workss[i].title;
        work.appendChild(imgWork)
        
        if(modalState === null){
            let figcaption = document.createElement('figcaption');
            figcaption.textContent = workss[i].title;
            work.appendChild(figcaption)
        }else{
            work.prepend(deleteIcon.cloneNode())
        }
        galleryZone.appendChild(work);
    }
    //Suppression 
    trashList = document.querySelectorAll('.list-photo-edit .fa-trash-can');
    trashList.forEach(async itemm => {
        deleteProject(itemm);
    });
    
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
            afficherTravaux(newWorksList,galleryZone, modal);
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
    afficherTravaux(worksEditZone, modal);

    //Ajout projet
    const addImgBtn = document.querySelector("#addImgBtn");
    addImgBtn.addEventListener('click', ()=>{
        const modalElmts = modalWrapper.children;
        let modalElmtsArray = Array.from(modalElmts);
        modalElmtsArray.forEach((item)=>{
            let itemClassList = Array.from(item.classList);
            if(itemClassList.includes('supp-form')){
                item.style.display = "none";
            }else{
                item.style.display = null;
            }
        });
        modalWrapper.classList.add('modal-wrapper-2');

        const formInputs = new FormData();
        const validateFormBtn = document.querySelector('#validateBtn');
        let validForm = false;
        inputs.forEach(input => {
            input.addEventListener('change', (e)=>{
                const focusedInput = e.target;
                const addImgZone = document.querySelector('.add-img');
                if(focusedInput.id === "imageUrl" && focusedInput.files[0]){
                    for(const item of addImgZone.children){
                        if(item.id === "img-preview"){
                            const fileReader = new FileReader();
                            fileReader.onload = (e) => {item.setAttribute('src',focusedInput.result);}
                            fileReader.readAsDataURL(focusedInput.files[0]);
                            item.setAttribute('style','display: null');
                        }else{
                            item.setAttribute('style','display: none');
                        }                        
                    }
                }else if(!inputs[0].files[0]){
                    for(const item of addImgZone.children){
                        // console.log(item);
                        if(item.id === "img-preview" || item.id === "imageUrl"){
                            item.setAttribute('style','display: none');
                            // console.log(e.target.value);
                        }else{
                            item.setAttribute('style','display: null');
                        }                        
                    }
                }
                for(const input of inputs){
                    if(input.value.trim() == ""){
                        validForm = false; 
                        break;
                    }
                    validForm = true;
                }         
                console.log(validForm);
                
                (validForm) ? validateFormBtn.classList.add('okColor') : validateFormBtn.classList.remove('okColor');
            });
        });
        
        
        validateFormBtn.addEventListener('click', async(e)=>{
            if(validForm){
                formInputs.append("image", imgUrl.files[0])
                formInputs.append("title", title.value);
                formInputs.append("category", category.value);
                
                // console.log(Object.fromEntries(formInputs));
                await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    body: formInputs,
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                    }               
                });
                refreshInputs();
                validForm = false;
                afficherTravaux(worksZone,false);
            }
        });
        // Retour à la modal de suppression de projet
        const goBackArrowBtn = document.querySelector('.fa-arrow-left');
        goBackArrowBtn.addEventListener('click', ()=>{
            goBackArrow(modalWrapper,modalElmtsArray);
        });
    });
    modal.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    modal.querySelector('.modal-wrapper').addEventListener('click', stopPropagation);
}

const refreshInputs = function(){
    inputs.map(input =>{
        input.value = "";
    })
}
const closeModal = function(e){
    if(modal === null){
        return
    }
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.querySelector('.modal-wrapper').removeEventListener('click', stopPropagation);
    setModal(null);
    refreshInputs();
}

const goBackArrow = function(modalZone,elementList){
    elementList.forEach((item)=>{
        let itemClassList = Array.from(item.classList);
        if(itemClassList.includes('add-form')){
            item.style.display = "none";
        }else{
            item.style.display = null;
        }
    });
    modalZone.classList.remove('modal-wrapper-2');
    afficherTravaux(worksEditZone, modal);
    // const trashList = document.querySelectorAll('.list-photo-edit .fa-trash-can');
    refreshInputs();
}

const stopPropagation = function(e){
    e.stopPropagation();
}

// const deleteProject = async function(e){
//     console.log('hello');
//     console.log('e: '+ e);
//     console.log(e.target);
//     const projectId = e.target.parentNode.dataset.id;
    
//     let myToken = sessionStorage.getItem('token');
//     console.log(myToken);
//     const reponseDelWork = await fetch(`http://localhost:5678/api/works/${projectId}`, {
//         method: "DELETE",
//         headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
//     });
//     const delWork = reponseDelWork.json();
//     console.log(`Réponse status: ${delWork.status}` );
// }
const deleteProject = async function(trashItem){
    trashItem.addEventListener('click', async (e) => { 
        const idProject = e.target.parentElement.dataset.id;
        const rep = await fetch(`http://localhost:5678/api/works/${idProject}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });
        e.target.parentElement.remove();
        afficherTravaux(worksZone,modal)
    });     
}

const setCategories = function(inputArea, categorieList){  
    categorieList.map((cat)=>{
        let cateOption = document.createElement('option');
        cateOption.setAttribute("value", cat.id)
        cateOption.textContent = cat.name
        inputArea.appendChild(cateOption); 
    })
} 


