class ItemManager {
    constructor(){
        this.datas =  []
        this.port = "59371"
    }
    // Cette methode recupère toutes les annonces de la base de données
    async fetchDatas(){
        try{
            const promise = await fetch(`http://localhost:${this.port}/item`)
            if (!promise.ok){
                throw new TypeError("Requête échoué")
            }
            this.datas = await promise.json()
        }catch(e){
            throw new TypeError(e)
        }finally{
            return this.datas
        }
    }
    // getAll Recupere les annonces d'un utilisateur bien precis
    async getAll(id){
        try{
            const promise = await fetch(`http://localhost:${this.port}/items/${id}`,{
                body :  data
            })
            if (!promise.ok){
                throw new TypeError("Requête échoué")
            }
            return await promise.json()
        }
        catch(e){
            throw new TypeError(e)
        }
    }
    getData(){
        return this.datas
    }
    async saveAd(data){
        try{
            const promise = await fetch(`http://localhost:${this.port}/item`,{
                method : 'POST',
                body :  data
            })
            if (!promise.ok){
                throw new TypeError("Requête échoué")
            }
            this.datas = await promise.json()
        }
        catch(e){
            throw new TypeError(e)
        }
    }
}
export default ItemManager