import Controller from "./Controller.js";
import ItemManager from "../model/Manager/ItemManager.js";

class Main extends Controller{
    constructor(){
        super()
        this.ItemsManager = new ItemManager()
        this.datas =  []
        // On checks le localStorage$

        // if (localStorage.getItem("Items")){
        //     this.datas = localStorage.getItem("Items")
        // }else{
        //     this.datas = this.ItemsManager.fetchDatas()
        //     localStorage.setItem("Items",this.datas)
        // }
        // Les controlles
        this.btnSearch =  document.querySelector('input[name="search"]')
        this.residenceName = document.querySelector('select[name="Residence"]')
        this.serie = document.querySelector('select[name="serie"]')
        this.worth = document.querySelector( 'select[name="worth"]')
        this.inputSort = document.querySelector('select[name="sort"]')
        this.listItems =   document.querySelector("ul#listItems");
        this.btnDeleteFilters =  document.querySelector('button#deleteFilters')
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
            this.residenceName.selectedIndex =  0
            this.serie.selectedIndex =  0
            this.worth.selectedIndex =  0
            this.inputSort.selectedIndex =  0
        })
        this.fillItems(this.datas)
    }
    // La methode qui remplie les items
    async fillItems(data){
        // ON vide la liste en premier
        this.listItems.innerHTML =""
        // On recupère le composant  card de la page d'acceuil et on le transform en noeud du DOM...
        const cardString = await fetch("src/template/Component/card.html").then(response  => response.text()).catch( e => console.log(e))
        const parser  =  new DOMParser()
        const cardDOM =  parser.parseFromString(cardString,"text/html")
        for(let i = 0; i<20; i++){
        // for(const item  of data){
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
            
            // image.src =  item.media[1] || ""
            // linkItem.textContent = item.name
            // worth.textContent =  item.worth
            // state.textContent = item.state
            // publishedDate.textContent =  item.publishedDate
            // residenceName.textContent =  item.address.name
            // linkAccount.textContent = item.publisher.name
            // linkAccount.href =  `/account?idAccount=${item.publisher.id}`
            // linkItem.href =  `/item?idItem=${item.id}`
            // On remplie les events
            // btnStar.addEventListener('click',this.addAtFavoris())
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
                        a.name.localeCompare(b.name)
                        break;
                    case "de Z à A" :  
                        b.name.localeCompare(a.name)
                        break;
                    case "Croissant" :
                        a.worth - b.worth
                        break;
                    case "Deccroissant" :
                        b.worth - a.worth  
                        break;
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
                filter.addEventListener("change",()=>{
                    const filtedDatas  =  this.datas.slice() 
                    filtedDatas.filter(item => {
                        return item.address.Name === this.residenceName && item.worth >= this.worth && item.serie === this.serie;
                    });
                    this.fillItems(filtedDatas)
                })
            }
        }
    }
    initialisePage(){
        this.fillItems(this.datas)
        this.sort()
        this.filter()
        this.deleteFilters()
        this.searchItems()
    }
}
export default Main;