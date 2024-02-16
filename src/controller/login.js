import UserFactory from "../model/Factory/UserFactory.js"
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
        let login =  document.querySelector("#email")
        let password =  document.querySelector("#password")
        let data = {"login" : encodeURIComponent(login.value), "password" : encodeURIComponent(password.value)}
        let response =  await  this.User.login(data)    
        // Si connexion réussie on met à jour l'affichage et redirection vers la page principale
        if (response.statut === 1){
            let profile = document.querySelector("#profile")
            let userName =  document.querySelector("#userName") 
            // On recupere les données du model
            let media  = this.User.medias()
            let data =  this.User.datas()
            debugger
            if (media){
                profile.className = `object-cover bg-[url(${media["location"]})]`
            }
            userName.innerHTML =  `${data.firstName} ${data.lastName}`
            // Redirection
            window.location.href = "/"
        }else{
           let txtErreur =  document.querySelector('#erreur')
           txtErreur.innerHTML = response.message;
        }
    }
    logout(){
    }
}
export default Login;