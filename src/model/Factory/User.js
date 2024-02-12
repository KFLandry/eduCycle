
class User {
  // On implemente le singleton pattern
  constructor() {
    if (this.exist){
      return this.uniqueInstance
    }
    this.data;
    this.exist =  true;
    this.connected =  false;
    this.uniqueInstance = this;
    this.medias = null;
  }
  
  async login(data){
      const req  =  await fetch("http://localhost:54064/login",{
        method :'POST',
        headers :  this.headers,
        body : JSON.stringify(data),
      })
      const response =  await req.json()
      if(response.statut === 1){
        this.connected = true;
        this.data =  response.data
      }
      return response
  }
  async signup(data){
    debugger
    let result  = await fetch("http://localhost:54064/signup",{
      method :'POST',
      body : JSON.stringify(data)
    })
    const response =  await result.json()
    //Si la connexion reussi on set l'utilisateur à "connected" avec ses données et on recupere son token d'autorisation
    if(response.statut === 1){
      this.connected = true;
      this.token =  response.token
      this.data =  response.data
      this.headers ={
        'Authorization' : `Bearer ${this.token}`,
        'content-type' :  "application/JSON"
      }
      this.loadMedia()
    }
    return response
  }
  async loadMedia(){
    let result  = await fetch(`http://localhost:54064/media/${this.data.id}`,{
      method :'POST',
      headers : this.headers,
      body : JSON.stringify(data)
    })
    const response =  await result.json()
    if (response.statut === 1){
      this.medias =  response.data
    } 
  }
  static isAuthenticated(){
    return this.connected
  }
}
export default User;