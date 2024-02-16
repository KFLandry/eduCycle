class ItemManager {
    constructor(){
        ItemManager.data;
    }
    async fetchDatas(){
        try{
            const promise =await fetch("",[])
            return (await promise).json()
        }catch(e){

        }
    }
}
export default ItemManager