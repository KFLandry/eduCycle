import { PORT } from "../../public/ressource/secret.js";

class User {
  // On implemente le singleton pattern
  constructor() {
    if (User.exists){
      return User.uniqueInstance
    }
    // A l'ouverture ou au rechargment de la page on verifie le sessionStoarage
    if (sessionStorage.getItem('token') && sessionStorage.getItem('userData')){
      this.connected = true;
      this.data =sessionStorage.getItem('userData')
      this.token = sessionStorage.getItem('token')
      this.headers ={
        'Authorization' : `Bearer ${this.token}`,
      }
    }
    this.data ={}
    this.media = {}
    this.connected = false;
    this.headers = {}
    this.port = PORT
    User.exists =  true;
    User.uniqueInstance = this;
  }
  async login(data){
      const req  =  await fetch(`http://localhost:${this.port}/login`,{
        method :'POST',
        body : JSON.stringify(data),
      })
      const response =  await req.json()
      if(response.statut === 1){
        this.connected = true;
        this.data =  response.data
        if (this.data.medias){this.data.medias.location =`http://localhost:${this.port}/${this.data.medias.location}`;}
        this.headers ={
          'Authorization' : `Bearer ${this.data.token}`,
        }
      }
      return response
  }
  async signup(data){
    let result  = await fetch(`http://localhost:${this.port}/signup`,{
      method :'POST',
      body : JSON.stringify(data)
    })
    const response =  await result.json()
    //Si la connexion reussi on set l'utilisateur à "connected" avec ses données et on recupere son token d'autorisation qu'on stocke dans le SessionStorage
    if(response.statut === 1){
      this.connected = true;
      this.data =  response.data
      debugger
      if (this.datas.hasOwnProperty("medias")){
        this.data.medias.location =`http://localhost:${this.port}/${this.data.medias.location}`
      }
      this.headers ={
        'Authorization' : `Bearer ${this.data.token}`,
      }
    }
    return response
  }
  async getUser(id){
    try{
      const promsie =   await fetch(`http://localhost:${this.port}/user/${id}`,{
      })
      if (!promsie.ok){
          throw new TypeError("Requête échoué")
      }
      this.result = await promsie.json()
    }catch(e){
        throw new TypeError(e)
    }finally{
      if (this.result.hasOwnProperty("medias")){
        this.result.medias.location =`http://localhost:${this.port}/${this.result.medias.location}`
      }
      return this.result
    } 
  }
 async uploadProfile(formData){
    try{
      const promise = await fetch(`http://localhost:${this.port}/media`, {
        method : 'POST',
        body :  formData
      })
      if (!promise.ok){
          throw new TypeError("Requête échoué")
      }
      this.datas = await promise.json()
    }catch(e){
        throw new TypeError(e)
    }finally{
        if (this.datas.statut !== 1 ){throw new Error("L'insertion de profile a echoué! Detail :  \n"+ this.datas.message)}
    }
}
async fetch (ressource, method, param="", body=null){
  try{
      const promise = method ==='GET' ? await fetch(`http://localhost:${this.port}/${ressource}/${param}`) : await fetch(`http://localhost:${this.port}/${ressource}/${param }`,{
          method : `${method}`,
          body :  body
      })
      if (!promise.ok){
          throw new TypeError("Requête échoué")
      }
      this.datas = await promise.json()
  }
  catch(e){
      throw new TypeError(e)
  }
  finally{
      return this.datas
  }
}
  logout(){
      sessionStorage.clear()
      uniqueInstance = null
  }
  getId(){
    return this.data.id
  }
  isConnected(b){
    this.connected =  b
  }
  isAuthenticated(){
    return this.connected
  }
  static getUniqueInstance (){
    return User.uniqueInstance
  }
  getHeaders(){
    return this.headers
  }
  medias(){
    return this.media;
  }
  setCurrentUser(datasCurrentUser){
    this.data = datasCurrentUser
  }
  datas(){
    return this.data;
  }
}
new User
export default User;