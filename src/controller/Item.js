import ItemManager from "../model/Manager/ItemManager.js";
import Controller from "./Controller.js";

class Item extends Controller{
    constructor(){
        super()
        this.itemManager  = new ItemManager()
        this.urlParameters =  new URLSearchParams(window.location.search)
        if(this.urlParameters.has('idItem')){
            this.ItemData  =  this.itemManager.getItem(this.urlParameters.get('idItem'))
        }else{
            // alert("Ce lien ne fait reference à aucune annonce")
        }
        // Les  controlles
        this.btnRecover =  document.querySelector('button#recover')
        this.recoverForm =  document.querySelector('#recoverForm')   
    }
    fillPage(){
        // 
    }
    async fetchDatas(){
        // Le formulaire de recuperation 
        this.formRecover =  parser.parseFromString(form,"text/html")
    }
    async setControls(){
        const form = await fetch("src/template/Component/dialog.html").then(response => response.text() ).catch(e => console.log(e))
        this.recoverForm.innerHTML = form
        this.btnRecover.addEventListener('click', async () =>{
        })
    }
    initialisePage(){
        this.setControls()
    }
}
export default Item;