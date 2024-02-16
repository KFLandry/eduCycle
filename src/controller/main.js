import Controller from "./Controller.js";

class Main extends Controller{
    constructor(){
        super()
        this.ItemsManager = new this.ItemsManager()  
        this.datas
        // On checks le localStorage$

        if (localStorage.getItem("Items")){
            this.datas = localStorage.getItem("Items")
        }else{
            this.datas = this.ItemsManager.fetchDatas()
        }
        // Les controlles
        this.residenceName = document.querySelector("select#location")
        this.serie = document.querySelector("select#serie")
        this.worth = document.querySelector("select#valeur")
        this.order = document.querySelector("select#filtre")
        this.listItems =   document.querySelector("ul#listItems");
    }
    fileItems(){
        for(const item  of this.datas){
            // On recupere les controlles de la cards
            const card =  document.querySelector("li.item")
            const image = document.querySelector('ul li img#profile')
            const name =  document.querySelector('ul li img#labelName')
            const worth =  document.querySelector('ul li img#worth')
            const publishedDate =  document.querySelector('ul li img#date')
            const publisherName =  document.querySelector('ul li img#publisherName')
            const residenceName =  document.querySelector('ul li img#location')
            // On les remplies
            image.src =  item.media[1]
            name.textContent = item.name
            worth.textContent =  item.worth
            publishedDate.textContent =  item.publishedDate
            residenceName.textContent =  item.address.name
            publisherName.textContent = item.publisher.name
            // On ajoute la card a la liste d'items
            this.listItems.appendChild(card)
        }
    }
    filter(){
        const listFilters =  document.querySelectorAll("div#filter select")
        for( const filter of listFilters){
            filter.addEventListener("input",()=>{
                const filtedDatas =  this.datas.filter( item => {
                    const filteredDatas = this.datas.filter(item => {
                        return item.address.Name === this.residenceName && item.worth >= this.worth && item.serie === this.serie;
                    });
                    
                })
            })
        }
    }
    initialisePage(){
        this.fileItems()
    }
}
export default Main;