import UserFactory from "../model/Factory/UserFactory.js";
import ItemManager from "../model/Manager/ItemManager.js";
// import Email from "../model/Service/CustomEmail.js";
import { APITOKEN, DOMAINFRONT, EMAILTEST } from "../public/ressource/secret.js";
import { CustomRouter } from "../public/router.js";
import Controller from "./Controller.js";

// La page associé à ce controller deux entrées : Connexion et mis à jour de mot de passe
class Login extends Controller{
    constructor(){
        super()
        this.User = new UserFactory("USER")
        this.manager = new ItemManager()
        this.txtErreur =  document.querySelector('#erreur')
        this.divLogin =  document.querySelector('#login')
        this.divUpdate  = document.querySelector('#updatePassword')
        this.btnSubmit =  document.querySelector("#submit")
        this.btnUpdate =  document.querySelector("#update")
        this.inputUpdatedPassword = document.querySelector("#passwordUpdated")
        this.inputPassword =  document.querySelector("#password")
        this.inputEmail =  document.querySelector("#email")
        this.inputConfirm = document.querySelector("#confirm")
        this.label  = document.querySelector("#text")
        this.currentTest =  ""
        // On defini le template correspondant
        this.urlParameters =  new URLSearchParams(window.location.search)
        this.idUser=""
        if (!this.urlParameters.has("id")) {
            this.label.textContent = "Connexion"
            this.divLogin.classList.remove("hidden")
            this.divLogin.classList.add("flex")
        }else{
            this.idUser =  this.urlParameters.get('id')
            this.label.textContent = "Changer de mot de passe \n"
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
            if (this.inputPassword.value && this.inputEmail.value){
                let data = {"login" : this.inputEmail.value, "password" : this.inputPassword.value}
                let response =  await  this.User.login(data)    
                // Si connexion réussie on met à jour l'affichage et redirection vers la page principale
                if (response.statut === 1){           
                    // Session Storage
                    sessionStorage.setItem('currentUser', JSON.stringify(this.User.datas()))
                    // Redirection
                    window.history.pushState({}, "", "/"); // Modifier l'URL sans recharger la page
                    CustomRouter.handleLocation()
                }else{
                   this.txtErreur.textContent = response.message;
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
                if (this.inputEmail.value){
                    // On verifie l'existance du compte dans la base
                    let user = await this.manager.fetch("user","GET",this.inputEmail.value)
                    if (user instanceof Array || user.hasOwnProperty('id')){
                        if (user.hasOwnProperty('id')){
                            await this.sendEmail("PasswordVerif", this.inputEmail.value, `${DOMAINFRONT}/login?id=${user.id}`, JSON.stringify({password : user.email}))
                        }else{
                            this.txtErreur.textContent ="Aucun compte n'est crée avec cette adresse email!"
                        }    
                    }else{
                        this.txtErreur.textContent ="Problème de connexion au serveur \Details :\n"+user.message
                    }
                }else{
                    this.txtErreur.textContent =  "Veuillez entrer votre email"
                }
            })
            // Valider les champs requis
         
            
            this.inputUpdatedPassword.addEventListener('input', () => {
                this.currentTest = ""
                // Vérification de mot de passe
                this.currentTest +=!(new RegExp("[A-Z]").test(this.inputUpdatedPassword.value)) ? "=> Contenir au moins une majuscule\n": ""
                this.currentTest +=!(new RegExp("[a-z]").test(this.inputUpdatedPassword.value)) ? "=> Contenir au moins une minuscule\n": ""
                this.currentTest +=!(new RegExp("\\d").test(this.inputUpdatedPassword.value)) ? "=> Contenir au moins un chiffre\n": ""
                this.currentTest +=!(new RegExp("\\W").test(this.inputUpdatedPassword.value)) ? "=> Contenir au moins un caractére special\n": ""
                this.currentTest +=(this.inputUpdatedPassword.value.length < 8) ? "=> Contenir au moins 8 caractéres\n": ""
                if (this.currentTest){
                    this.currentTest = "Votre mot de passe doit :  \n"+this.currentTest
                    this.inputUpdatedPassword.setAttribute("title", this.currentTest)
                }else{
                    this.inputUpdatedPassword.setAttribute("title", "")
                }
                })
                this.inputConfirm.addEventListener('input', () => {
                    if (this.inputConfirm.value!==this.inputUpdatedPassword.value){
                        this.currentTest = "\n Les deux champs doivent correspondres"
                        this.inputConfirm.setAttribute("title",this.currentTest)
                    }else{
                        this.inputConfirm.setAttribute("title", "")
                        this.currentTest=""
                    }
                })
                //Bouton de MAJ
            this.btnUpdate.addEventListener("click",async (e) => {
                e.preventDefault()
                if (this.inputConfirm.value && this.inputUpdatedPassword.value){
                    if (!this.currentTest){
                        let result =await this.manager.fetch("user","PATCH",this.urlParameters.get("id"),JSON.stringify({id: this.idUser,password : this.inputConfirm.value}))
                        if(result.statut=1){
                            alert("Opération réussie 👌 \n Vous allez être redidrigé à la page de connexion!")
                            window.history.pushState({}, "", "/"); // Modifier l'URL sans recharger la page
                            CustomRouter.handleLocation()
                        }else{
                            alert("Une erreur est survenu.  \n Detail  : "+result.message)
                        }
                    }else {
                        alert(this.currentTest)
                    }
                }else{
                    alert("Veuillez renseigner tous les champs !")
                }})
    }

    async sendEmail(what,to, link){
        let stringTemplate = await fetch(`src/template/EmailTemplate/${what}.html`).then( (resp) => resp.text())
        let parser = new DOMParser()
        let DOMTemplate =  parser.parseFromString(stringTemplate, "text/html")
        DOMTemplate.querySelector("a#link").href = link    
        Email.send({
            SecureToken : APITOKEN,
            To : to,
            From : EMAILTEST,
            Subject : "",
            Body : DOMTemplate.documentElement.outerHTML
        }).then(message =>{
            if (message=="OK"){
                alert("Un mail de vérification a été envoyé à l'adresse saisie 📧✨")
            }else{alert("Opération échoué !"+message)}
        })
       ;
    }
    initialisePage(){
        this.setControls()
    }
}
export default Login;