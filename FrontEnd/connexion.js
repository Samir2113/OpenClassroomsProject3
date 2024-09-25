async function connexion(){
    let inputList = document.querySelectorAll(".formulaire-connexion input");
    const logins = {
        "email": inputList[0].value,
        "password": inputList[1].value
    };
    const testLogin = await fetch("http://localhost:5678/api/users/login",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(logins)
    });

    if(testLogin.status === 200){
        let myLogin = await testLogin.json();
        let myLoginToken = myLogin.token;
        sessionStorage.setItem("token",myLoginToken);
        document.location.href="index.html";
        
    }else{
        alert("Erreur! Veuillez entrer un e-mail et mdp valides.")
    }
} 

let connectForm = document.querySelector(".formulaire-connexion");
connectForm.addEventListener("submit", async function(e){
    e.preventDefault();
    connexion();
})