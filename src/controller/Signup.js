import User from "../model/Factory/User.js";
import { LOGIN, PASSWORD } from "../public/ressource/secret.js";
import Controller from "./Controller.js";
import { CustomRouter } from "../public/router.js";

class Signup extends Controller{
    constructor(){
        super();
        // Je recupere l'instance si exiistante de l'Utilisateur     
        this.User  =  new User()
    }
    initialisePage(){
        const btnSignUp  =  document.querySelector("#submit")
        btnSignUp.addEventListener('click', (event) =>{
            event.preventDefault()
            this.signup()
        })
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