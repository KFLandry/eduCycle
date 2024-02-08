class User {
  constructor() {
    if (this.exist){
      return this.uniqueInstance
    }
    this.exist =  true;
    this.uniqueInstance = this;
    this.medias = null;
    const token = "eyJ1c2VyX2lkIjoxMjMsInJvbGVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwiZW1haWwiOiJjb250YWN0QGRlbW8uZnIifQ.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlhdCI6MTcwNzMzMTE2MiwiZXhwIjoxNzA5OTIzMTYyfQ.pzwfTQoNBvTILSE1MhO3A4U7yBlWxe45HgcVxLIfBQk"
    this.headers ={
      'Authorization' : `Bearer ${token}`,
      'content-type' :  "application/JSON"
    }
  }
  login(data){
      fetch("http://localhost:61692/login",{
        method :'POST',
        headers :  this.headers,
        body : JSON.stringify(data),
      }).then(response => response.json())
      .then(data => console.log(data))
      .catch(e => console.log(e));
  }
  async signup(){
    let result  = await fetch("http://localhost/Projetweb/signup",{
      method : "POST",
      body : JSON.stringify(data)
    })
    let response =  await result.json()
    return response
  }
}
export default User;