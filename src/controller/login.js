import UserFactory from "../model/Factory/UserFactory.js"
class Login{
    constructor(){
        this.User = new UserFactory("USER")
        this.btnSubmit =  document.querySelector("#submit")
        this.btnSubmit.addEventListener('click',(event) => {
            event.preventDefault()
            this.login()
        })
    }
    login(){
        debugger
        let login =  document.querySelector("#email")
        let password =  document.querySelector("#password")
        let data = {"login" : login.value, "password" : password.value}
        this.User.login(data)
    }
    logout(){

    }
    createCookies(){

    }
}
new Login();