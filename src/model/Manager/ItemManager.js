import { DOMAINBACK } from "../../public/ressource/secret.js";
class ItemManager {
    constructor(){
        this.AllDatas =  []
        this.fileItems =  []
        this.data ={}
    }
    // Cette methode recupère toutes les annonces de la base de données
    // Cette methode se charge de requete le serveur
    // Parametre =>   
    // ressource  :  nom de la ressource à requeter(user, item, comment,...)
    // method  : verbe de la requête (GET, POST , PUT, DELETE)
    // param (optionel) : paramètre de la requete (id, email)
    // body  (optionel):  corps de la requête (JSON, Objet FormData)
    // Retour  => JSON        
     async fetch (ressource, method, param="", body=null){
        try{
            const promise = method ==='GET' ? await fetch(`${DOMAINBACK}/${ressource}${(typeof param==="number" || !param ) ? "/" : "?id="}${param}`) : await fetch(`${DOMAINBACK}/${ressource}/${param }`,{
                method : `${method}`,
                body :  body
            })
            if (!promise.ok){
                this.data = {statut :  3, message : "Requête échouée"}
            }
            this.datas = await promise.json()
        }
        catch(e){
            this.datas = { statut :  3, message : e}
        }
        finally{
            return this.datas
        }
     }
    async fetchDatas(){
        try{
            const promise = await fetch(`${DOMAINBACK}/item`)
            if (!promise.ok){
                throw new TypeError("Requête échoué")
            }
            this.datas = await promise.json()
        }catch(e){
            throw new TypeError(e)
        }finally{
            this.datas.forEach(item => { item.medias.forEach(file => file.location =`${DOMAINBACK}/${file.location}`)});
            return this.datas
        }
    }
    // getAll Recupere les annonces d'un utilisateur bien prècis
    async getAll(id){
        try{
            const promise = await fetch(`${DOMAINBACK}/items/${id}`,{
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
                this.datas.forEach(item => { item.medias.forEach(file => file.location = `${DOMAINBACK}/${file.location}`)});
                return this.datas
            }else return []
        }
    }
    async getMainDatas(){
        await this.fetch('item','GET')
        if ( this.datas instanceof Array ){
            this.mainDatas =  this.datas.filter( row  => { return row.statut === "normal"})
        }else {
            this.mainDatas =  this.datas
        }
        return this.mainDatas
    }
    getData(){
        return this.datas;
    }
    async saveAd(data){
        try{
            const promise = await fetch(`${DOMAINBACK}/item`,{
                method : 'POST',
                body :  data
            })
            if (!promise.ok){
                throw new TypeError("Requête échoué")
            }
            this.datas = await promise.json()
        }
        catch(e){
            this.datas =  { statut : 3, message :  e}
        }finally{
            return this.datas
        }
    }
    async delete(id) {
        try{
            const promise = await fetch(`${DOMAINBACK}/item/${id}`,{
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