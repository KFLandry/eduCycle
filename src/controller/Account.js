import User from "../model/Factory/User.js";
import ItemManager from "../model/Manager/ItemManager.js";
import Controller from "./Controller.js";

class Account extends Controller{
    // La page acceuuil a deux entrée un en pour l-utilisateur et l'autre pour les autres
    constructor(){
        super()
        this.uniqueInstance = User.getUniqueInstance()
        this.itemManager = new ItemManager()
        // Les controlles 
        this.imgProlile = document.querySelector("img#profile")
        this.inputChangeProfile =   document.querySelector('input[name="profile"]')
        this.labelNames = document.querySelectorAll('#labelName')
        this.lablePhone =  document.querySelector("p#labelPhone")
        this.emailStatut = document.querySelector("p#emailState")
        this.labelEmail = document.querySelector("p#labelEmail")
        this.memberSince = document.querySelector("span#labelSince")
        this.residence =  document.querySelector('p#labelAdress')
        this.nbAnnonce = document.querySelector("span#nbAnnonces")
        this.nbRecuperation = document.querySelector("span#ndRecuperations")
        this.linkUpdateProfile =  document.querySelector('a#updateProfile')
        this.btnEmailVerification =  document.querySelector('button#emailVerification')
        this.btnDelete =  document.querySelector('button#delete')
        this.btnDeconnexion =  document.querySelector('button#deconnexion')
        this.listAnnonces =  document.querySelector('ul#annonces')
        this.listRecuperations =  document.querySelector('ul#recuperations')
        // La carte des annonces et recuperation
        this.userData  = {}
        this.cardAnnonce  = null
        this.cardRecuperations = null
        this.mesAnnonces = {}
        this.mesRecuperations = {}
    }
    async fetchDatas(){
        // Cards
        const card =   await fetch("src/template/Component/card.html").then(response => response.text()).catch(e =>console.log())
        const parser = new DOMParser()
        this.cardAnnonce = parser.parseFromString(card,"text/html")
        this.cardRecuperation =  parser.parseFromString(card,"text/html")
        // Datas
        const Datas  =await this.itemManager.fetch('item','GET',this.userData.id)
        this.mesAnnonces = Datas.filter(item => item.statut !== "Validé")
        this.mesRecuperations = Datas.filter(item => item.statut === "Validé")
        this.userData['nbAnnonces'] =  this.mesAnnonces.length || 0
        this.userData['nbRecuperations'] =  this.mesRecuperations.length  || 0
    }
    enableUserControls(display){
        //On des/active les controls
        // les Controlles qui nécessite un authentification de l'utilisateur
        let userControllers = document.querySelectorAll("[name='authorize']")
        for(const control of userControllers){
            control.style.display =    display ? "flex" : "none"
        }
        
        userControllers = this.cardAnnonce.querySelectorAll("[name='authorize']")
        for(const control of userControllers){
            control.style.display =  display ? "flex" : "none"   
        }
        // les Controlles qui ne nécessite pas un authentification de l'utilisateur
        userControllers = document.querySelectorAll("[name='unauthorize']")
        for(const control of userControllers){
            control.style.display =  display ? "none" : "flex"       
        }
        userControllers = this.cardAnnonce.querySelectorAll("[name='unauthorize']")
        for(const control of userControllers){
            control.style.display =  display ? "none" : "flex"  
        }
    }
    sendEmailVerification(){
        // 
    }
    fillUser(){
        // Les controlles   
        const user =  this.userData
        if (user.hasOwnProperty('medias')){
            this.imgProlile.src = user.medias.location || ""
        }
        this.labelNames[1].textContent = user.firstName + " " + user.lastName
        this.lablePhone.textContent = user.phone
        if (user.emailVerified){
            this.emailStatut.textContent = "Email verifié"
            this.emailStatut.className =  "rounded-md p-1 bg-green-400"
        }else{
            this.emailStatut.textContent = "Email Non verifié"
            this.emailStatut.className =  "rounded-md p-1 bg-yellow-400"
        }
        this.emailStatut.textContent = user.emailVerified ? "Email verifié" : "Email Non verifié"
        this.labelEmail.textContent =user.email
        this.memberSince.textContent =user.dateCreation
        this.residence.textContent =user.residence
        this.nbAnnonce.textContent =user.nbAnnonces
        this.nbRecuperation.textContent =user.nbRecuperations
        this.linkUpdateProfile.href = `/signup?id=${user.id}`        
    }
    fillList(which,data){
        // On clone la card
        let card =  ""
        if(which === "annonce"){
            card =  this.cardAnnonce.querySelector("li#item")
            this.listAnnonces.innerHTML = ""
            //  On retire les controlles et ajoute la mise en favoris
        }else if(this.listRecuperations.style.display === "flex"){
            card =  this.cardRecuperation.querySelector("li#item")
            this.listRecuperations.innerHTML = ""
        }
        const listFavoris =  JSON.parse(localStorage.getItem('favoris')) || []
        for(const item of data){
            if (!card) {
                break
            }
            card  = card.cloneNode(true)
            const image = card.querySelector('img#itemPhoto')
            const linkItem =  card.querySelector('a#itemName')
            const state =  card.querySelector('p#itemState ')
            const worth =  card.querySelector('span#itemWorth')
            const publishedDate =  card.querySelector('span#itemPublisherDate')
            const residenceName =  card.querySelector('#itemLocation')
            const linkAccount =  card.querySelector('a#account')
            const btnStar =  card.querySelector("button#favor")
            const btnDelete =  card.querySelector("button#delete")
            const linkEdit =  card.querySelector("a#edit")
            const labelStatut = card.querySelector("p#statut")
            const iconStatut = card.querySelector('i#statut')
            // On les remplie...
            if (item.hasOwnProperty('medias')){
                image.src =  item.medias.length > 0 ? item.medias[0].location : ""
            }
            linkItem.textContent = item.name
            worth.textContent =  item.worth
            state.textContent = item.state
            publishedDate.textContent =  item.publishedDate
            residenceName.textContent =  item.residence
            linkAccount.textContent = item.publisher.name
            linkAccount.href =  `/account?idAccount=${item.publisher.id}`
            linkItem.href =  `/item?idItem=${item.id}`
            linkEdit.href =  `/don?idItem=${item.id}`
            labelStatut.textContent =  item.statut
            if (item.statut !== 'normal'){
                labelStatut.textContent =  item.statut
                iconStatut.classList.remove('hidden')
                if(item.statut === "En attente de validation"){
                    iconStatut.classList.add("bg-orange-400")
                }else if(item.statut === "Validé"){
                    iconStatut.classList.add("bg-green-400")
                }else if(item.statut === "En attente de récupéraion"){
                    iconStatut.classList.add("bg-yellow-400")
                }
            }
            // 
            let found = listFavoris.some( ad => JSON.stringify(ad) === JSON.stringify(item))
            if (found){btnStar.classList.add("bg-yellow-400")}
            // On remplie les events
            // On uilise le localStorage pour la gestion des favoris
            btnStar.addEventListener('click',() => {
                let found = listFavoris.some( ad => JSON.stringify(ad) === JSON.stringify(item))
                if (!found){
                    alert(`L'annonce du/de la ${item.name} de ${item.publisher.name} a été ajouteé dans vos favoris✨✔`)
                    listFavoris.push(item)
                    btnStar.classList.add("bg-yellow-400")
                }else{
                    if (confirm('Cette annonce existe deja dans vos favoris.Voulez-vous le supprimer??')){
                        listFavoris.pop(item)
                        btnStar.classList.remove("bg-yellow-400")
                    }
                }
            })
            btnDelete.addEventListener('click',(event) => {
                if (confirm("Etes-vous sur et certain de vouloir supprimer cette annonce??")){
                    const result = this.itemManager.fetch('item','DELETE',item.id)
                    if (result.statut ===1){
                        const liToRemove =  event.target.closest('li')
                        this.listAnnonces.removeChild(liToRemove)
                    }else{
                        alert("Un problème est survenu gros😩!Réessayes plus tard.La comnunauté te pris de l'excuser😔")
                    }
                }
            })
            // On ajoute la card à la liste d'items
            if (which  === "annonce"){
                this.listAnnonces.appendChild(card)
            }else{
                this.listRecuperations.appendChild(card)
            }
        }
    }
    setControls(id){
        // Upload profile 
        this.inputChangeProfile.addEventListener('change', () =>{
            const reader = new FileReader()
            reader.onload = (event)=>{ 
                this.imgProlile.src = event.target.result
            }
            reader.readAsDataURL(this.inputChangeProfile.files[0])
            const form =  document.querySelector('form[name="profile"]')
            const formData = new FormData(form)
            formData.append('idUser', id)
            formData.append('name','profile')
            debugger
            this.uniqueInstance.uploadProfile(formData)
        })
        // Deconnexion
        this.btnDeconnexion.addEventListener('click', () => {
            debugger
            if(confirm("Etes-vous sûr de vouloir nous quitter???")){
                alert("Vous allez etre rediriger vers la page d'acceuil")
                window.location.href = "/"          
            }
        } ) 
        // Suppression du compte
        this.btnDelete.addEventListener('click', () => {
            if (confirm("Etes-vous sur ne plus vouloir faire partir de la commnunauté des etudiants d'EduCyle??")){
                alert("Nous sommes navrés de vous voir nous quitter 😩.Mais sachez que vous étes et serait toujours le/la bienvenu(e)!")
                this.uniqueInstance.delete('acccount',id)
                window.location.href('/')
            }
        })
        // 
        this.linkUpdateProfile.href = `/signup?idUser=${id}`
        // 
        this.btnEmailVerification.addEventListener('click', this.sendEmailVerification())
        
    }
   async initialisePage(){        
        this.urlParameters =  new URLSearchParams(window.location.search)
        await this.fetchDatas()
        if (this.urlParameters.has('idAccount') && this.urlParameters.get('idAccount')>0){
            if (this.uniqueInstance.isAuthenticated() && this.urlParameters.get('idAccount')==this.uniqueInstance.getId()){
                this.enableUserControls(true)
                this.userData = await  this.uniqueInstance.datas(this.userData.id)
                window.history.pushState({},"","/account")
            }else{
                this.enableUserControls(false)  
                this.userData  = await this.uniqueInstance.getUser(this.urlParameters.get('idAccount'))
            }
        }else if(this.uniqueInstance.isAuthenticated() && !this.urlParameters.has('idAccount')){
            this.enableUserControls(true)
            this.userData = await  this.uniqueInstance.datas(this.userData.id)
        }else {
            alert("Aucune reference à un compte n'a été trouvée!")
            window.location.href =  "/"
        }
        this.fillUser()
        this.fillList('annonce',this.mesAnnonces)
        this.fillList('recuperation',this.mesRecuperations)
        this.setControls(this.userData.id)
    }
}
export default Account;
