class ItemManager {
    constructor(){
        this.datas =  []
        this.port = "50234"
    }
    async fetchDatas(){
        try{
            const promise = await fetch(`http://localhost:${this.port}/item`)
            if (!promise.ok){
                throw new TypeError("Requête échoué")
            }
            this.datas = await promise.json()
             for await (const data of this.datas){
                promise =  await fetch(`http://localhost:${this.port}/media/${data.id}`)
                this.datas[medias] =  await promise.json()
            }
        }catch(e){
            throw new TypeError(e)
        }finally{
            return this.datas
        }
    }
    getData(){
        return this.datas
    }
    async uploadImages(headers,data){
        debugger
        try{
            // Pour ce cas les content C'est un image/*
            const promsie =   await fetch(`http://localhost:${this.port}/media`,{
                method : 'POST',
                headers : headers,
                body : data
            })
            debugger
            if (!promsie.ok){
                throw new TypeError("Requête échoué")
            }
            this.datas = await promsie.json()
        }catch(e){
            throw new TypeError(e)
        }
    }
    
    async saveAd(headers,data){
        try{
            const promise = await fetch(`http://localhost:${this.port}/media`,{
                method : 'POST',
                headers : headers,
                body :  data
                // body :  JSON.stringify(data)
            })
            debugger
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