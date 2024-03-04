import User from "../model/Factory/User.js";
import Controller from "./Controller.js";
import { CustomRouter } from "../public/router.js";

class Signup extends Controller{
    constructor(){
        super();
        // La Page a deux entrées une pour la creation et l'autre pour la mise à jour
        this.urlParameters =  new URLSearchParams(window.location.search)
        if (this.urlParameters.has('idUser')){
            if (this.urlParameters.get('idUser') < 0 || !this.urlParameters.get('idUser')){
                alert("Les paramètres de l'url ne font reference a aucun compte!")
                window.history.pushState({},"","/")
                CustomRouter.handleLocation
            }else{
                document.querySelector('h1#title').textContent = "Mise à jour de vos informations"
                document.querySelector('#update').classList.remove('hidden')
                document.querySelector('#update').classList.add('flex')
                document.querySelector('div#signup').classList.add("hidden")
                document.querySelector('div#signup').classList.remove("flex")
            }
        }
        this.User  =  new User()
        this.inputFindResidence =  document.querySelector('input#residence')
    }
    initialisePage(){
        
        this.setControls()
        this.findResidence()
    }
    setControls(){
        const btnSignUp  =  document.querySelector("#submit")
        btnSignUp.addEventListener('click', (event) =>{
            event.preventDefault()
            this.signup()
        })
        // La mise à jour
        document.querySelector("button#update").addEventListener('click', (event)=> {
            event.preventDefault()
            const formData =  new FormData(document.querySelector("#SignupForm"))
            formData.append('id',this.urlParameters.get('idUser'))
            const result = this.User.fetch("user","PATCH","",formData)
            if (result.statut === 1){
                alert('Mise à jour reussie!')
                sessionStorage.removeItem('currentUser')
                window.history.pushState({},"","/account")
                CustomRouter.handleLocation
            }
        })
    }
    findResidence(){
        const options = {
        componentRestrictions: { country: "fr" },
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: true,
        types: ["establishment","school"],
        };
        new google.maps.places.Autocomplete(this.inputFindResidence, options);
    }
    async signup(){
        // Methode d'inscription du controller de la classe Signup
        const form = document.querySelector("#SignupForm")
        this.formData = new FormData(form) 

        // Si le client coche remember me
        let cbRememberMe = document.querySelector("#remember");
        if(cbRememberMe.checked){
            this.saveCredentials()
        }
        if (document.querySelector("#terms").checked){
            //On échappe les données utilisateurs avant l'envoi au serveur pour éviter les errreurs XSS(Cross-Site Scripting)
            let secureData = {}
            secureData["role"] =  "USER";
            this.formData.forEach((value,key) => { 
                secureData[key] = encodeURIComponent(value);
            });
            let response =  await  this.User.signup(secureData)
            if (response.statut === 1){
                // Si connexion reussie,On maj l'affichage et on stocke l'utilisateur dans le sessionStorage
                sessionStorage.setItem('currentUser', JSON.stringify(response.data))
                CustomRouter.handleLocation()
            }else{
               let txtErreur =  document.querySelector('#erreur')
               txtErreur.innerHTML = response.message;
            }
        }
    } 
    saveCredentials(){
        // LOGIN = this.formData.get("email")
        // PASSWORD = this.formData.get("password")
    }
}
export default Signup;