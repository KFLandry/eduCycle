
class User {
  // On implemente le singleton pattern
  constructor() {
    if (User.exist){
       return User.uniqueInstance
    }
    User.data;
    User.media;
    User.connected =  false;
    User.uniqueInstance = this;
    User.token;
    User.headers;
    User.port = "62015";
    User.exist =  true;
  }
  
  async login(data){
      const req  =  await fetch(`http://localhost:${User.port}/login`,{
        method :'POST',
        headers :  this.headers,
        body : JSON.stringify(data),
      })
      const response =  await req.json()
      debugger
      if(response.statut === 1){
        User.connected = true;
        User.token =  response.token
        User.data =  response.data
        User.headers ={
          'Authorization' : `Bearer ${User.token}`,
          'content-type' :  "application/JSON"
        }
        await this.loadMedia()
      }
      return response
  }
  async signup(data){
    let result  = await fetch(`http://localhost:${User.port}/signup`,{
      method :'POST',
      body : JSON.stringify(data)
    })
    const response =  await result.json()
    //Si la connexion reussi on set l'utilisateur à "connected" avec ses données et on recupere son token d'autorisation
    if(response.statut === 1){
      User.connected = true;
      User.token =  response.token
      User.data =  response.data
      User.headers ={
        'Authorization' : `Bearer ${User.token}`,
        'content-type' :  "application/JSON"
      }
       await this.loadMedia()
    }
    return response
  }
  async loadMedia(){
    let result  = await fetch(`http://localhost:${User.port}/media/${User.data.id}`,{
      method :'POST',
      headers : User.headers,
      body : JSON.stringify({"table_ass":"ed_user"})
    })
    const response =  await result.json()
    debugger
    // S'il le serveur retourne une erreur....
    if (response.statut === 1){
      User.media =  response.data
    } 
    console.log(response)
  }
  static isAuthenticated(){
    return User.connected
  }
  medias(){
    return User.media;
  }
  datas(){
    return User.data;
  }
}
export default User;