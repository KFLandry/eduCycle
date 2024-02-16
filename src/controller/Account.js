import Controller from "./Controller.js";

class Account extends Controller{
    constructor(){
        super()
        // Les controlles 
        this.profilePhoto = document.querySelector("#profile")
        this.btnChangeImage =   document.querySelector("i#changeImage")
        this.labelName = document.querySelector('p#labelName')
        this.lablePhone =  docucment.querySelector("p#labelPhone")
        this.emailStatut = document.querySecletor("p#emailState")
        this.labelEmail = document.querySelector("p#labelEmail")
        this.memberSince = document.querySelector("span#labesSince")
        this.residence =  document.querySelector('p#labelAdress')
        this.nbAnnonce = document.querySelector("span#nbAnnonces")
        this.nbRecuperation = document.querySelector("span#ndRecuperations")
    }
    initialisePage(){}
}
export default Account;