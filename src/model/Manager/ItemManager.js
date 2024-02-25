class ItemManager {
    constructor(){
        this.datas =  []
        this.port = "64468"
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
            debugger
            this.datas.forEach(item => { item.medias.forEach(file => file.location =`http://localhost:${this.port}/${file.location}`)});
            return this.datas
        }
    }
    // getAll Recupere les annonces d'un utilisateur bien precis
    async getAll(id){
        try{
            const promise = await fetch(`http://localhost:${this.port}/items/${id}`,{
            })
            if (!promise.ok){
                throw new TypeError("Requête échoué")
            }
            this.datas = await promise.json()
        }
        catch(e){
            throw new TypeError(e)
        }finally{
            if (this.datas.statut !==2 || this.datas.length > 0){
                this.datas.forEach(item => { item.medias.forEach(file => file.location = `http://localhost:${this.port}/${file.location}`)});
                return this.datas
            }else return []
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
    async delete(id) {
        try{
            const promise = await fetch(`http://localhost:${this.port}/item/${id}`,{
                method : 'DELETE',
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