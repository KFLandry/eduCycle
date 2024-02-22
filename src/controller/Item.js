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
            alert("Ce lien ne fait reference à aucune annonce")
        }
        // Les controlles
        
    }
    initialisePage(){}
}
export default Item;