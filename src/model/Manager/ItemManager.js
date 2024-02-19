class ItemManager {
    constructor(){
        this.datas =  []
        this.port = ""
    }
    async fetchDatas(){
        try{
            const promise = await fetch(`http://localhost:${this.port}/item`)
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
        try{
            const promsie =   await fetch(`http://localhost:${this.port}/item`,{
                method : 'POST',
                header : headers,
                body :  JSON.stringify(data)
            })
            this.datas = await promsie.json()
        }catch(e){
            throw new TypeError(e)
        }
    }
    
    async saveAd(headers,data){
        await fetch(`http://localhost:${this.port}/item`,{
            method : 'POST',
            header : headers,
            body :  JSON.stringify(data)
        }).then(response => {
            this.datas =  response.json()
        }).catch(e =>{
            throw new TypeError(e)
        }
        )   
    }
}
export default ItemManager