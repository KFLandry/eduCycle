// On definie la fonction de routage
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
const routes = {
    "/": "/src/template/index.html",
    "/index.html":"/src/template/index.html",
    "/login": "/src/template/login.html",
    "/signup": "/src/template/signup.html",
    "404": "/src/template/error.html"
};

// Fonction pour gérer la localisation actuelle
async function handleLocation() {
    const path = window.location.pathname;
    const routePath = routes[path] || routes["404"]; // Récupérer le chemin correspondant à l'URL ou la route 404
    const html = await fetch(routePath).then(response => response.text());
    document.getElementById("main-page").innerHTML = html;
}

// Attacher le gestionnaire d'événements aux liens correspondants
document.addEventListener('click', function(event) {
    if (event.target.matches('a[href]')) {
        route(event); // Appeler la fonction de routage lorsqu'un lien est cliqué
    }
});

// Gérer le changement d'état de navigation
window.onpopstate = handleLocation;
//Changement de la page principale 
handleLocation();