import Signup from "../controller/Signup.js";
import Main from "../controller/Main.js";
import Login from "../controller/Login.js";
import File from "../controller/File.js";
import User from "../model/Factory/User.js";
import Notification from "../controller/Notification.js"
import Account from "../controller/Account.js";
import Favoris from "../controller/Favoris.js";
import Don from "../controller/Don.js";
// On definie la fonction de routage et on creer l'unique instance de l'utilisateur
new User()
function route(event) {
    event.preventDefault();
    const target = event.target || event.srcElement;
    const href = target.getAttribute('href'); // Obtenir l'attribut href de l'élément cible
    if (href) {
        window.history.pushState({}, "", href); // Modifier l'URL sans recharger la page
        handleLocation(); // Appeler la fonction pour gérer la nouvelle URL
    }
}
// Définir les routes de l'application
const AuthRequiredRoutes = {
    "/file": "/src/template/file.html",
    "/notification": "/src/template/notification.html",
    "/don" : "/src/template/don.html",
}
const routes = {
    "/": "/src/template/index.html",
    "/index.html":"/src/template/index.html",
    "/login": "/src/template/login.html",
    "/signup": "/src/template/signup.html",
    "/item" : "/src/template/item.html",
    "/favoris": "/src/template/favoris.html",
    "/account" : "/src/template/account.html", 
    "/file": "/src/template/file.html",
    "/notification": "/src/template/notification.html",
    "/don" : "/src/template/don.html",
    "404": "/src/template/error.html"
};
// Fonction pour gérer la localisation actuelle et initialiser les controlleurs correspondants
 export async function handleLocation() {
    let path = window.location.pathname;
    // On force la redirection vers la page de connexion si pas connecté
    let routePath;
    let uniqueUser = User.getUniqueInstance()
    if (routes[path] || AuthRequiredRoutes[path]){        
        if (!uniqueUser.isAuthenticated() && path in AuthRequiredRoutes){
            // Pour test ON Retire             
            routePath =routes["/login"]
            path = "/login"
        }else if (!uniqueUser.isAuthenticated() || path in routes){
            routePath = routes[path]
        }else if (uniqueUser.isAuthenticated()) {
            routePath = routes[path]
        }
    }else{
        routePath = routes["404"]
    }
    // Récupérer le chemin correspondant à l'URL ou la route 404
    const html = await fetch(routePath).then(response => response.text());
    document.getElementById("main-page").innerHTML = html;

    // Les controllers
    let controller;
    switch (path){
        case "/index.html":
        case "/" :
            controller = new Main()
            break;
        case "/login" :    
            controller = new Login()
            break;
        case "/signup": 
            controller =  new Signup()
            break;
        case "/file" :
            controller = new File()
            break
        case "/don" :
            controller = new Don()
            break
        case "/notification" :
            controller =  new Notification()
            break
        case "/account" :
            controller =  new Account()
            break    
        case "favoris": 
            controller =  new Favoris()
            break;
        }
    controller.initialisePage();
}
// Attacher le gestionnaire d'événements aux liens correspondants
document.addEventListener('click', function(event) {
    if (event.target.matches('a[href]')) {
        route(event); // Appeler la fonction de routage lorsqu'un lien est cliqué
    }
});
// On gère la fermitur de l'onglet ou du navigateur
window.addEventListener('beforeunload', ()=>{
    sessionStorage.clear()
})
// Fonction qui cache et affiche le menu
function hidden(){
    let labelHam =  document.querySelector("#labelHam")
    labelHam.addEventListener("click", ()=>{
        let menu =  document.querySelector("#menu")
        if(menu.style.display=== "none" ){
            menu.style.display = "block"
            menu.focus()
        }else{
            menu.style.display = "none"
        }
    })
// 
    labelHam =  document.querySelector("#btnMenu")
    labelHam.addEventListener("click", ()=>{
        let menu =  document.querySelector("#sMenu")
        if(menu.style.display=== "none" ){
            menu.style.display = "block"
            menu.focus()
        }else{
            menu.style.display = "none"
        }
    })
}
const btnLogout = document.querySelector('#logout')
btnLogout.addEventListener('click',()=>{
    debugger
    if(confirm("Etes-vous sûr de vouloir nous quitter??")){
        const uniqueUser = User.getUniqueInstance()
        uniqueUser=null
        sessionStorage.clear()
        window.location.href ="/"
    }
})
// Gérer le changement d'état de navigation
window.onpopstate = handleLocation;
//Changement de la page principale
handleLocation();
hidden()