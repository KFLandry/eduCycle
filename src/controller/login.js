
import UserFactory from "../model/Factory/UserFactory.js"
import { handleLocation } from "../public/router.js"
import Controller from "./Controller.js"

class Login extends Controller{
    constructor(){
        super()
    } 
    initialisePage(){
        this.User = new UserFactory("USER")
        if(this.User.connected){

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
            // Si connexion reussie,On maj l'affichage et on stocke le token dans le localStorage            
            this.updateDisplay()
            // Redirection
            window.history.pushState({}, "", "/"); // Modifier l'URL sans recharger la page
            handleLocation()
        }else{
           txtErreur.textContent = response.message;
        }
    }
    logout(){}
    updateDisplay(){
        debugger
        const authorizeControls =  document.querySelectorAll('[name="authorize"]')
        const unauthorizeControls =  document.querySelectorAll('[name="unauthorize"]')
        let profile = document.querySelector("#profile")
        let userName =  document.querySelector("p#labelName") 
        // On recupere les données du model
        const media  = this.User.medias()
        const data =  this.User.datas()
        if (media){
            const image=  document.createElement('img')
            image.src =  media.location
            image.alt =  'profile'
            image.className = "rounded-full border objet-cover size-full"
            profile.appendChild(image)
        }
        userName.textContent = `${data.firstName}`
        // On active les controls
        for(const control of authorizeControls){
            control.display = 'block'
        }
        for(const control of unauthorizeControls){
            control.display = 'none'
        }
    }
}
export default Login;