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
        this.btnChangeImage =   document.querySelector("i#changeImage")
        this.labelName = document.querySelector('p#labelName')
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
        this.cardRecuperations =  null
        this.urlParameters =  new URLSearchParams(window.location.search)
        this.fetchCards()
        if(this.urlParameters.has('idAccount')){
            this.enableUserControls('hidden')
            this.userData  =  this.uniqueInstance.getUser(this.urlParameters.get('idAccount'))
        }else{
            // On recupere les information de l'utilisateur logé
            this.enableUserControls('flex')
            this.userData =  this.uniqueInstance.datas(this.userData.id)
        }
        this.cardAnnonce = this.itemManager.getAll(this.userData.id).filter(item => item.statut !== "Validé")
        this.cardRecuperations = this.itemManager.getAll(this.userData.id).filter(item => item.statut === "Validé")
    }
    async fetchCards(){
        debugger
        const cardRecup =   await fetch("src/template/Component/maRecupation.html").then(response => response.text()).catch(e =>console.log())
        const cardAn =  await fetch("src/template/Component/monAnnonce.html").then(response => response.text()).catch(e =>console.log())
        debugger
        const parser = new DOMParser()
        this.cardAnnonce =  parser.parseFromString(cardAn,"text/html")
        this.cardRecuperation =  parser.parseFromString(cardRecup,"text/html")
    }
    enableUserControls(display){
        //On desactive les controls
        debugger
        const divControls =  this.cardAnnonce.querySelector('#controls')
        const divRecuperation  =  document.querySelector('#recuperations')
        this.btnChangeImage.style.display =  display
        this.linkUpdateProfile.style.display =  display
        this.btnEmailVerification.style.display =  display
        this.btnDelete.style.display =  display
        this.btnDeconnexion.style.display =display
        divControls.innerHTML =  '<i id="iconStar"  class="rounded-md fa-regular fa-star p-2  hover:bg-yellow-400"></i>'
        divRecuperation.style.display =display
    }
    sendEmailVerification(){
        // 
    }
    deconnexion(){
        if(confirm("Etes-vous sûr de vouloir nous quitter???")){
            this.User = null            
        }
    }
    fillUser(){
        // Les controlles     
        const user =  this.userData
        this.imgProlile =user.media[1]
        // this.btnChangeImage = user.
        this.labelName.textContent = user.firstName + " " + user.lastName
        this.lablePhone.textContent = user.phone
        if (user.emailIsVerified){
            this.emailStatut.textContent = "Email verifié"
            this.emailStatut.className =  "bg-green-400"
        }else{
            this.emailStatut.textContent = "Email Non verifié"
            this.emailStatut.className =  "bg-yellow-400"
        }
        this.emailStatut.textContent = user.emailIsVerified ? "Email verifié" : "Email Non verifié"
        this.labelEmail.textContent =user.email
        this.memberSince.textContent =user.dateCreation
        this.residence.textContent =user.residence
        this.nbAnnonce.textContent =user.nbAnnonce
        this.nbRecuperation.textContent =user.nbRecuperation
        this.linkUpdateProfile.href = `/signup?id=${user.id}`        
    }
    fillList(which,data){
        debugger
        this.listAnnonces.innerHTML = ""
        this.listRecuperations.innerHTML = ""
        for(const item of data){
            // On clone la card
            let card =  ""
            if(which === "annonce"){
                card =  this.cardAnnonce.querySelector("li#item").cloneNode(true)
                //  On retire les controlles et ajoute la mise en favoris
            }else{
                card =  this.cardRecuperation.querySelector("li#item").cloneNode(true)
            }
            const image = card.querySelector('img#itemPhoto')
            const linkItem =  card.querySelector('a#itemName')
            const state =  card.querySelector('p#itemState ')
            const worth =  card.querySelector('span#itemWorth')
            const publishedDate =  card.querySelector('span#itemPublisherDate')
            const residenceName =  card.querySelector('#itemLocation')
            const linkAccount =  card.querySelector('a#account')
            const btnStar =  card.querySelector("i#iconStar")
            const labelStatut = card.querySelector("p#statut")
            const iconStatut = card.querySelector('i#statut')
            // On les remplie...
            image.src =  item.media[1] || ""
            linkItem.textContent = item.name
            worth.textContent =  item.worth
            state.textContent = item.state
            publishedDate.textContent =  item.publishedDate
            residenceName.textContent =  item.address.name
            linkAccount.textContent = item.publisher.name
            linkAccount.href =  `/account?idAccount=${item.publisher.id}`
            linkItem.href =  `/item?idItem=${item.id}`
            labelStatut.textContent =  item.statut
            if(item.statut === "En attente de validation"){
                iconStatut.className = "bg-orange-400"
            }else if(item.statut === "Validé"){
                iconStatut.className = "bg-green-400"
            }else{
                iconStatut.className = "bg-yellow-400"
            }
            // On remplie les events
            // On uilise le localStorage pour la gestion des favoris
            btnStar.addEventListener('click',() => {
                const listFavoris = []
                if (!localStorage.getItem("favoris")){
                    listFavoris  = JSON.parse(localStorage.getItem("favoris"))
                }
                listFavoris.push(item)
                localStorage.setItem('favoris',JSON.stringify(listFavoris))
            })
            // On ajoute la card à la liste d'items
            if (which  === "annonce"){
                this.listAnnonces.appendChild(card)
            }else{
                this.listRecuperations.appendChild(card)
            }
        }
    }
    deleteAccount(){
        this.btnDelete.addEventListener("click",() => {
            this.uniqueInstance.delete('acccount',id)
        })
    }
    deleleAnnonce(id){
            this.btnDelete.addEventListener("click",() => {
            this.uniqueInstance.delete('item',id)
        })
    }
    initialisePage(){
        this.fillUser()
        this.fillList('annonce',this.mesAnnonces)
        this.fillList('recuperation',this.mesRecuperations)
    }
}
export default Account;
