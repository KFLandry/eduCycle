
class User {
  // On implemente le singleton pattern
  constructor() {
    if (User.exists){
       return User.uniqueInstance
    }
    this.data ={}
    this.media = {}
    this.connected =  false;
    this.token =""
    this.headers = {}
    this.port = "62015";
    User.exists =  true;
    User.uniqueInstance = this;
  }
  
  async login(data){
      const req  =  await fetch(`http://localhost:${this.port}/login`,{
        method :'POST',
        headers :  this.headers,
        body : JSON.stringify(data),
      })
      const response =  await req.json()
      debugger
      if(response.statut === 1){
        this.connected = true;
        this.token =  response.token
        this.data =  response.data
        this.headers ={
          'Authorization' : `Bearer ${this.token}`,
          'content-type' :  "application/JSON"
        }
        await this.loadMedia()
      }
      return response
  }
  async signup(data){
    let result  = await fetch(`http://localhost:${this.port}/signup`,{
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
        'Authorization' : `Bearer ${User.token}`,
        'content-type' :  "application/JSON"
      }
       await this.loadMedia()
    }
    return response
  }
  async loadMedia(){
    let result  = await fetch(`http://localhost:${this.port}/media/${this.data.id}`,{
      method :'POST',
      headers : this.headers,
      body : JSON.stringify({"table_ass":"ed_user"})
    })
    const response =  await result.json()
    debugger
    // S'il le serveur retourne une erreur....
    if (response.statut === 1){
      this.media =  response.data
    } 
    console.log(response)
  }
  static isAuthenticated(){
    return this.connected
  }
  medias(){
    return this.media;
  }
  datas(){
    return this.data;
  }
}
export default User;