
import UserFactory from "../model/Factory/UserFactory.js"
import { CustomRouter } from "../public/router.js"
import Controller from "./Controller.js"

class Login extends Controller{
    constructor(){
        super()
    } 
    initialisePage(){
        this.User = new UserFactory("USER")
        if(this.User.connected){
            // 
        }else{
            this.btnSubmit =  document.querySelector("#submit")
            this.btnSubmit.addEventListener('click',(event) => {
                event.preventDefault()
                this.login()
            })
        }
    }
    async login(){
        let txtErreur =  document.querySelector('#erreur')
        txtErreur.textContent = ""
        let login =  document.querySelector("#email")
        let password =  document.querySelector("#password")
        let data = {"login" : encodeURIComponent(login.value), "password" : encodeURIComponent(password.value)}
        let response =  await  this.User.login(data)    
        // Si connexion réussie on met à jour l'affichage et redirection vers la page principale
        if (response.statut === 1){           
            // Session Storage
            sessionStorage.setItem('currentUser', JSON.stringify(response.data))
            // Redirection
            window.history.pushState({}, "", "/"); // Modifier l'URL sans recharger la page
            CustomRouter.handleLocation()
        }else{
           txtErreur.textContent = response.message;
        }
    }
}
export default Login;