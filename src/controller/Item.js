import ItemManager from "../model/Manager/ItemManager.js";
import Controller from "./Controller.js";
import User from "../model/Factory/User.js";
import { CustomRouter } from "../public/router.js";
class Item extends Controller{
    constructor(){
        super()
        // Les  controlles
        this.formDOM = null
        this.btnRecover =  document.querySelector('button#toggle')
        this.recoverForm =  document.querySelector('#recoverForm') 
        this.listImages = document.querySelector('ul#itemImages')
        this.cardImage = null
    }
    fillPage(){
        document.querySelectorAll('#itemName').forEach(elem => elem.textContent =  this.ItemDatas.name)
        document.querySelector('span#itemCategories').textContent = this.ItemDatas.categories
        document.querySelector("span#itemState").textContent = this.ItemDatas.state
        document.querySelector("span#itemWorth").textContent =  this.ItemDatas.worth
        document.querySelectorAll('span#itemPublishedDate').forEach( elem => elem.textContent =this.ItemDatas.publisherDate )
        document.querySelectorAll('#span#itemSince').forEach( elem => elem.textContent = this.ItemDatas.Since + this.ItemDatas.period)
        document.querySelector('p#description').textContent =  this.ItemDatas.description
        this.listImages.innerHTML = ""
        for (const image of this.ItemDatas.medias){
            const card  =  this.cardImage.querySelector('li').cloneNode(true)
            const img  =  card.querySelector('img')
            img.src = image.location
            this.listImages.appendChild(card)
        }
    }
    async fetchDatas(){
        // 
        this.itemManager  = new ItemManager()
        this.urlParameters =  new URLSearchParams(window.location.search)
        if(this.urlParameters.has('idItem')){
            this.ItemDatas  = await this.itemManager.fetch('item','GET',this.urlParameters.get('idItem'))
        }else{
            window.pushState("","","/")
            CustomRouter.handleLocation()
        }
        // 
        const form = await fetch("src/template/Component/dialog.html").then(response => response.text() ).catch(e => console.log(e))
        const card = await fetch("src/template/Component/cardImage.html").then(response => response.text() ).catch(e => console.log(e))
        this.recoverForm.innerHTML = form
        const parser = new DOMParser()
        this.formDOM =  parser.parseFromString(form,"text/html")
        this.cardImage =  parser.parseFromString(card,'text/html')
    }
    async setFormControls(){    
        this.formDOM.querySelector('button#cancel').addEventListener('click', ()=>{
            if (confirm("Etes-vous sur de vouloir annuler cette recupération??")){
                this.formDOM.classList.remove("flex")
                this.formDOM.classList.add("hidden")
            }
        })
        this.formDOM.querySelector('button[type="submit"]').addEventListener('click', () => {
            const user  = User.getUniqueInstance();
            const formData =  new FormData(this.formDOM)
            formData.append("idItem",  this.currentItem)
            formData.append("idUser",  user.getId())
            this.itemManager.fetch("donation",'POST',formData)
            const result =  this.itemManager.getData()
            if (result.statut === 1){
                Alert("La demande de récuperation c'est faite avec succés!Consulter votre file pour suivre l'evolution\n Merci✨")
                this.formDOM.classList.remove("flex")
                this.formDOM.classList.add("hidden")
                this.btnRecover.disabled =  true
            }else{
                Alert("We're so sorry!😔 but something went wrong!\n We urge to try later")
                window.location.href =  "/"
            }
        })
    }
    setControls(){
        this.recoverForm.popover =  "auto"
        this.btnRecover.popoverTargetElement  =  this.recoverForm
        this.btnRecover.popoverTargetAction  = "toggle"
    }
     async initialisePage(){
        await this.fetchDatas()
        this.setControls()
        this.fillPage()
    }
}
export default Item;