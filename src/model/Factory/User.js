class User {
  // On implemente le singleton pattern
  constructor() {
    debugger
    if (User.exists){
       return User.uniqueInstance
    }
    this.data ={}
    this.media = {}
    this.connected = false;
    this.token =""
    this.headers = {}
    this.port = "50759";
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
        this.data =  response.data
        this.token =  response.token
        localStorage.setItem('token',response.token)
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
    //Si la connexion reussi on set l'utilisateur à "connected" avec ses données et on recupere son token d'autorisation qu'on stocke dans le localStorage
    if(response.statut === 1){
      this.connected = true;
      this.data =  response.data
      this.token =  response.token
      localStorage.setItem('token',response.token)
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
      headers : this.headers,
      // body : JSON.stringify({"table_ass":"ed_user"})
    })
    const response =  await result.json()
    debugger
    // S'il le serveur retourne une erreur....
    if (response.statut === 1){
      this.media =  response.data
    } 
    console.log(response)
  }
  delete(what,fields){

  }
  updateItem(what,fields){

  }
  udpate(fields){

  }
  isAuthenticated(){
    return this.connected
  }
  static getUniqueInstance (){
    return User.uniqueInstance
  }
  getHeader(){
    return this.headers
  }
  mesAnnonces(){

  }
  mesRecuperation(){
    
  }
  medias(){
    return this.media;
  }
  datas(){
    return this.data;
  }
}
export default User;