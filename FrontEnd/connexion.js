async function connexion(){
    console.log("je suis ici");
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
        console.log("here");
        let myLogin = await testLogin.json();
        let myLoginToken = myLogin.token;
        sessionStorage.setItem("token",myLoginToken);
        document.location.href="index.html";
        
    }else{
        alert("Erreur! Veuillez entrer un e-mail et mdp valides.")
    }
} 


let connectForm = document.querySelector(".formulaire-connexion");
console.log(connectForm);
connectForm.addEventListener("submit", async function(e){
    console.log('holla');
    e.preventDefault();
    // sessionStorage.removeItem("token")
    connexion();
})