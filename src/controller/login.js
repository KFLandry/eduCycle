

import UserFactory from "../model/Factory/UserFactory.js"
import ItemManager from "../model/Manager/ItemManager.js";
// import Email from "../model/Service/CustomEmail.js";
import { DOMAINFRONT } from "../public/ressource/secret.js";
import { CustomRouter } from "../public/router.js";
import Controller from "./Controller.js"

// La page associé à ce controller deux entrées : Connexion et mis à jour de mot de passe
class Login extends Controller{
    constructor(){
        super()
        this.User = new UserFactory("USER")
        this.manager = new ItemManager()
        this.txtErreur =  document.querySelector('#erreur')
        this.divLogin =  document.querySelector('#login')
        this.divUpdate  = document.querySelector('#update')
        this.btnSubmit =  document.querySelector("#submit")
        this.btnUpdate =  document.querySelector("#update")
        // On defini le template correspondant
        this.urlParameters =  new URLSearchParams(window.location.search)
        if (this.urlParameters.has("id")) {
            this.divLogin.classList.remove("flex")
            this.divLogin.classList.add("hidden")
            this.divUpdate.classList.remove("hidden")
            this.divUpdate.classList.add("flex")
        }
    }
    setControls(){
        // 
        // Connexion
        this.btnSubmit.addEventListener('click',async (event) => {
            this.btnSubmit.textContent ='Sign up...'
            event.preventDefault()
            // Valider les champs requis
            let inputEmail = document.querySelector("input.email")
            let inputPassword = document.querySelector("input.password")
            if (inputPassword.textContent && inputEmail){
                let data = {"login" : inputEmail.value, "password" : inputPassword.value}
                let response =  await  this.User.login(data)    
                // Si connexion réussie on met à jour l'affichage et redirection vers la page principale
                if (response.statut === 1){           
                    // Session Storage
                    sessionStorage.setItem('currentUser', JSON.stringify(this.User.datas()))
                    // Redirection
                    window.history.pushState({}, "", "/"); // Modifier l'URL sans recharger la page
                    CustomRouter.handleLocation()
                }else{
                   txtErreur.textContent = response.message;
                }
            }else {
                alert("Veuillez remplir tous les champs obligatoires.");
            }
            this.btnSubmit.textContent ='Sign up'
            })

            // Section de mise à jour du mot de passe
            // 
            this.LinkPasswordForgot =  document.querySelector("#passwordForgot")
            this.btnUpdate = document.querySelector("#update")
            // Envoi de l'email de verificaiton à l'utilisateur
            this.LinkPasswordForgot.addEventListener("click", async ()=>{
                this.txtErreur.textContent =""
                let inputEmail  =  document.querySelector("#email")
                if (inputEmail.value){
                    // On check le compte
                    let user = await this.manager.fetch("user","GET",inputEmail.value)
                    // let user = await this.manager.fetch("user","GET",1)
                    if (user.statut==1){
                        let result = this.send("PasswordVerif", inputEmail.value, `${DOMAINFRONT}/login?id=${this.userData.id}`, JSON.stringify({password : inputEmail.value}))
                        if (result =="OK"){
                            alert('Un mail de verification vous a été envoyé📧')
                        }else{
                            alert("Le système a rencontré un probleme lors de l'envoi d'email.\nDetail :  \n "+ result)
                        }
                    }else{
                        this.txtErreur.textContent ="Aucun compte n'est crée avec cette adresse email!"    
                    }
                }else{
                    this.txtErreur.textContent =  "Veuillez entrer votre email"
                }
            })
            this.btnUpdate.addEventListener("click",async () => {
                 // Valider les champs requis
                let inputPassWord = document.querySelector("input.password")
                let inputConfirm = document.querySelector("input.password")
                if (inputConfirm.textContent && inputPassWord.textContent){
                    inputPassWord.addEventListener('input', () => {
                        // Vérification de mot de passe
                        let currentTest =  ""
                        currentTest =(new RegExp("[A-Z]").test(inputPassWord.textContent)) ? "=> Contenir au moins une majuscule\n": ""
                        currentTest =(new RegExp("[a-z]").test(inputPassWord.textContent)) ? "=> Contenir au moins une minuscule\n": ""
                        currentTest =(new RegExp("[\d]").test(inputPassWord.textContent)) ? "=> Contenir au moins un chiffre\n": ""
                        currentTest =(new RegExp("[\W]").test(inputPassWord.textContent)) ? "=> Contenir au moins un caractére special\n": ""
                        currentTest =!inputPassWord.textContent.length() < 8 ? "Contenir au moins caractére special\n": ""
                        if (!currentTest) {
                            this.manager.fetch("user","PATCH",this.urlParameters.get("id"),JSON.stringify({password : inputConfirm.textContent}))
                        }else{
                            alert("Votre mot de de passe doit :  \n"+currentTest)
                        }
                    })
                    inputConfirm.addEventListener('input', () => {
                    })
                }else{
                    alert("Veuillez renseigner tous les champs !")
                }
            })
    }
    async login(){
        this.txtErreur.textContent = ""
        let login =  document.querySelector("#email")
        let password =  document.querySelector("#password")
       
    }
    send(what,to, link){
        let stringTemplate =  fetch(`src/template/EmailTemplate/${what}.html`).then( (resp) => resp.text())
        let parser = new DOMParser()
        let DOMTemplate =  parser.parseFromString(stringTemplate)
        DOMTemplate.querySelector("a#link").href = link    
        Email.send({
            SecureToken : APITOKEN,
            To : to,
            From : EMAILTEST,
            Subject : DOMTemplate.querySelector("#subject").textContent,
            Body : DOMTemplate.body
        }).then(message => message)
       ;
    }
    initialisePage(){
        this.setControls()
    }
}
export default Login;