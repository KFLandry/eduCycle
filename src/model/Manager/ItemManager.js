import { PORT } from "../../public/ressource/secret.js"

class ItemManager {
    constructor(){
        this.AllDatas =  []
        this.fileItems =  []
        this.port = PORT
    }
    // Cette methode recupère toutes les annonces de la base de données
     async fetch (ressource,method,param="",body=null){
        try{
            const promise = method==='GET' ? await fetch(`http://localhost:${this.port}/${ressource}/${param}`,{
                method : `${method}`,
            }) : await fetch(`http://localhost:${this.port}/${ressource}/${param}`,{
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
            if (this.datas.hasOwnProperty("publisher")){ this.datas.publisher.medias.location = `http://localhost:${this.port}/${this.datas.publisher.medias.location}`}
            if (this.datas.hasOwnProperty("medias")){
                this.datas.medias.forEach(file =>{
                    if (!file.location.startsWith("http")){
                        file.location =`http://localhost:${this.port}/${file.location}`}
                })
            }  
            return this.datas
            }
     }
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
            this.datas.forEach(item => { item.medias.forEach(file => file.location =`http://localhost:${this.port}/${file.location}`)});
            return this.datas
        }
    }
    // getAll Recupere les annonces d'un utilisateur bien prècis
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
    async getFileDatas(iduser){
        await this.fetchDatas()
        this.fileItems =  this.datas.filter( row  => {return row.idUser === iduser && row.statut !== "normal"})
        return this.fileItems
    }
    getData(){
        return this.datas;
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