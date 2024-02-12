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
        debugger
        let login =  document.querySelector("#email")
        let password =  document.querySelector("#password")
        let data = {"login" : login.value, "password" : password.value}
        let response =  await  this.User.login(data)
        console.log(response.statut)
        if (response.statut === 1){
            
        }else{
           let txtErreur =  document.querySelector('#erreur')
           txtErreur.innerHTML = response.message;
        }
    }
    logout(){
    }
}
export default Login;