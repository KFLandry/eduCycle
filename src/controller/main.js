import Controller from "./Controller.js";
import ItemManager from "../model/Manager/ItemManager.js";

class Main extends Controller{
    constructor(){
        super()
        this.ItemsManager = new ItemManager()
        this.datas = {}
        this.filtedDatas ={}
        // Les controlles
        this.btnSearch =  document.querySelector('input[name="search"]')
        this.inputSort = document.querySelector('select[name="sort"]')
        this.filtertSerie = document.querySelector('select[name="serie"]')
        this.filterWorth = document.querySelector('select[name="worth"]')
        this.filterResidence = document.querySelector('select[name="residence"]')
        this.listItems =   document.querySelector("ul#listItems");
        this.btnDeleteFilters =  document.querySelector('button#deleteFilters')
    }
    async loadDatas(){
        if (sessionStorage.getItem("Items")){
            this.datas = JSON.parse(sessionStorage.getItem("Items"))
        }else{
         this.datas = await this.ItemsManager.fetchDatas()
         sessionStorage.setItem("Items",JSON.stringify(this.datas))
        }
        
        this.filtedDatas = this.datas.slice() 
    }
    addAtFavoris(idItems){
    }
    searchItems(){
        this.btnSearch.addEventListener("input",(event) =>{
            event.preventDefault()
            // On recherche fullText
            this.fillItems()
        })
    }
    deleteFilters(){
        this.btnDeleteFilters.addEventListener("click", () => {
            debugger
            this.filterResidence.selectedIndex =  0
            this.filtertSerie.selectedIndex =  0
            this.filterWorth.selectedIndex =  0
            this.inputSort.selectedIndex =  0
            this.fillItems(this.datas)
        })
    }
    // La methode qui remplie les items
    async fillItems(datas){
        // ON vide la liste en premier
        this.listItems.innerHTML =""
        // On recupère le composant  card de la page d'acceuil et on le transform en noeud du DOM...
        const cardString = await fetch("src/template/Component/card.html").then(response  => response.text()).catch( e => console.log(e))
        const parser  =  new DOMParser()
        const cardDOM =  parser.parseFromString(cardString,"text/html")
        for(let i=0;i<datas.length; i++){
            const item = datas[i];
            // On recupere les controlles de la cards  et on clone l'original
            const card =  cardDOM.querySelector("li#item").cloneNode(true)
            const image = card.querySelector('img#itemPhoto')
            const linkItem =  card.querySelector('a#itemName')
            const state =  card.querySelector('p#itemState ')
            const worth =  card.querySelector('span#itemWorth')
            const publishedDate =  card.querySelector('span#itemPublisherDate')
            const residenceName =  card.querySelector('#itemLocation')
            const linkAccount =  card.querySelector('a#account')
            const btnStar =  card.querySelector("i#iconStar")
            // On les remplie...
            if (item.hasOwnProperty('medias')){
                image.src = item.medias.length>0 ? item.medias[0].location : ""
            }
            linkItem.textContent = item.name
            worth.textContent =  item.worth
            state.textContent = item.state
            publishedDate.textContent =  item.publishedDate
            residenceName.textContent =  item.residence
            linkAccount.textContent = item.publisher.name
            linkAccount.href =  `/account?idAccount=${item.publisher.id}`
            linkItem.href =  `/item?idItem=${item.id}`
            // On remplie les events
            btnStar.addEventListener('click',this.addAtFavoris())
            // On ajoute la card à la liste d'items
            this.listItems.appendChild(card)
        }
    }
    sort(){
        this.inputSort.addEventListener("input",() =>{
            const sortedDatas =  this.datas.slice()
            // On range
            sortedDatas.sort( (a,b) => {
                switch (this.inputSort.value){
                    case "de A à Z" :
                        return a.name.localeCompare(b.name)
                    case "de Z à A" :  
                        return b.name.localeCompare(a.name)
                    case "Croissant" :
                        return a.worth - b.worth
                    case "Deccroissant" :
                        return b.worth - a.worth  
                }
            })
            // On met a jour l'affichage avec le tableau rangé
            this.fillItems(sortedDatas)
        }) 
    }
    filter(){
        const listFilters =  document.querySelectorAll("div#filter select")
        for( const filter of listFilters){
            // Le select #sort est géré differement
            if (filter !== this.inputSort){
                filter.addEventListener("input",()=>{
                    debugger
                    switch (filter){
                        case this.filtertSerie : 
                            this.filtedDatas =  this.filtedDatas.filter(item => {
                                category = item.category.split(",")
                                return category.include(filter.value)
                            });
                            break
                        case this.filterWorth : 
                            this.filtedDatas =  this.filtedDatas.filter(item => {
                                return item.worth >= filter.value
                                 });
                            break
                        case this.filterResidence :  
                            this.filtedDatas =  this.filtedDatas.filter(item => {
                                return item.residence === filter.value
                            });
                            break
                    }
                    this.fillItems(this.filtedDatas)
                })
            }
        }
    }
    async initialisePage(){
        // On checks le sessionStorage
        await this.loadDatas()
        this.fillItems(this.datas)
        this.sort()
        this.filter()
        this.deleteFilters()
        this.searchItems()
    }
}
export default Main;