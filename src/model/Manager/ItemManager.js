class ItemManager {
    constructor(){
        this.datas =  []
    }
    async fetchDatas(){
        try{
            const promise = await fetch(`http://localhost:${this.port}/item`,[])
            
            this.datas = await promise.json()
        }catch(e){
            this.datas =  []
        }finally{
            return this.datas
        }
    }
    getData(){
        return this.datas
    }

}
export default ItemManager