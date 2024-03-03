import ItemManager from "../model/Manager/ItemManager.js";
import Controller from "./Controller.js";
import User from '../model/Factory/User.js'

class File extends Controller{
    constructor(){
        super()
        this.itemManager =  new ItemManager()
        this.user  = User.getUniqueInstance()
        this.datas =  []
        this.card = ""    
        this.listDatas =  document.querySelector('ul#file')
        this.divComment =  document.querySelector('.comment')
        this.btnClear = document.querySelector('button.clear')
    }
    async fetchDatas(){
        const stringCard = await fetch('src/template/Component/card.html').then(resp => resp.text()).catch(e => console.log(e))
        const parser  =  new DOMParser()
        this.card =  parser.parseFromString(stringCard,'text/html')
        const controls = this.card.querySelector('#file')
        controls.classList.add('flex')
        controls.classList.remove('hidden')
        // 
        this.divComment.innerHTML = await fetch('src/template/Component/formComment.html').then(resp => resp.text()).catch(e => console.log(e))
        // 
        this.datas = await this.itemManager.getFileDatas(this.user.getId()) || []

    }
   async setControls(){
        this.btnClear.addEventListener('click', async () => {
            if (confirm("Est-ce que t'es sûr sûr de vouloir  entierement vider ta file" )){
                for (item of this.datas){
                    const body =  {id : item.id, statut :  'normal'} 
                    const result = await this.itemManager.fetch('item',"PATCH","",JSON.stringify(body))
                    if (result.statut !== 1 ){
                        alert("Un problème est survenu!😤Ressayer plutard!")
                        break;
                    }
                }
            }
        })
        this.listDatas.innerHTML = ""
    }
    setControlsForms(){
        // On defini le controlle des etoiles pour l'evaluation
        const stars =  document.querySelectorAll("#stars svg")
        stars.forEach( (star,index1) => {
            star.addEventListener('click', ()=>{
                document.querySelector('input[name="note"]').textContent =  index1
                stars.forEach( (star,index2) => {
                    star.style = index1 >= index2 ? "color: #FFD43B;" : "color: #E6E9EF;"
                })
            })
        })   
        // Les controlles du forms   
        const btnSubmit = document.querySelector('button#submit') 
        const btnCancel = document.querySelector('button#cancel') 
        btnSubmit.addEventListener('click', ()=> {
            const form =  document.querySelector('.formComment')
            const formDatas =  new FormData(formComment)
            formDatas.append('idItem', this.datas.id)
            formDatas.append('idSender',this.user.getId())
            const result =this.itemManager.fetch("comment",'POST','',formDatas)
            if (result.statut === 1){
                alert("La communauté te souhaite de profiter de la deuxieme u truc que t'a recuperé!Et n'oublie pas 😌 chaque action compte✨😉")
                this.divComment.innerHTML = ""
            }
        })

        btnCancel.addEventListener('click', ()=> {
            this.divComment.innerHTML = ""
            this.divComment.style.display ="hidden"
        })
    }
    fillList(){
        this.listDatas.innerHTML = ""
        for (const item of this.datas){
            const card  = this.card.querySelector('li#item').cloneNode(true)
            const image = card.querySelector('img#itemPhoto')
            const linkItem =  card.querySelector('a#itemName')
            const state =  card.querySelector('p#itemState ')
            const worth =  card.querySelector('span#itemWorth')
            const publishedDate =  card.querySelector('span#itemPublisherDate')
            const residenceName =  card.querySelector('#itemLocation')
            const linkAccount =  card.querySelector('a#account')
            const linkEdit =  card.querySelector("a#edit")
            const labelStatut = card.querySelector("p#statut")
            const iconStatut = card.querySelector('i#statut')
            const btnAccept =  card.querySelector("button#accept")
            const btnDeny =  card.querySelector("button#deny")
            const btnDelete =  card.querySelector("button#delete_file")
            // On les remplie...
            if (item.hasOwnProperty('medias')){
                image.src =  item.medias.length > 0 ? item.medias[0].location : ""
            }
            linkItem.textContent = item.name
            worth.textContent =  item.worth
            state.textContent = item.state
            publishedDate.textContent =  item.publishedDate
            residenceName.textContent =  item.residence
            linkAccount.textContent = item.publisher.name
            linkAccount.href =  `/account?idAccount=${item.publisher.id}`
            linkItem.href =  `/item?idItem=${item.id}`
            linkEdit.href =  `/don?idItem=${item.id}`
            labelStatut.textContent =  item.statut
            if(item.statut === "En attente de validation"){
                iconStatut.classList.add("bg-orange-400")
            }else if(item.statut === "Validé"){
                iconStatut.classList.add("bg-green-400")
            }else{
                iconStatut.classList.add("bg-yellow-400")
            }
            // On defini les events 
            btnAccept.addEventListener('click',async (event) =>{
                const body =  {id : item.id, statut :  'En attente de récupération'}
                const result =await this.itemManager.fetch('item',"PATCH","",JSON.stringify(body))
                if (result.statut === 1 ){
                    this.divComment.innerHTML = await fetch('src/template/Component/formComment.html').then(resp => resp.text()).catch(e => console.log(e))
                    this.divComment.style.display ="flex"
                    const liToRemove = event.target.closest('li')
                    this.listDatas.removeChild(liToRemove)
                }
            })
            btnDeny.addEventListener('click',async (event) =>{
                const body =  {id : item.id, statut :  'normal'} 
                const result =await this.itemManager.fetch('item',"PATCH","",JSON.stringify(body))
                if (result.statut === 1 ){
                    alert("Pas de souci mec.✨😉")
                    let favoris = JSON.parse(localStorage.getItem('favoris')) || []
                    favoris.push(item)
                    localStorage.setItem('favoris',JSON.stringify(item))
                    const liToRemove = event.target.closest('li')
                    this.listDatas.removeChild(liToRemove)
                }
            })
            btnDelete.addEventListener('click', async (event) =>{
                const body =  {id : item.id, statut :  'normal'} 
                const result =await this.itemManager.fetch('item',"PATCH","",JSON.stringify(body))
                if (result.statut === 1 ){
                    alert("Pas de souci mec✨😉")
                    const liToRemove = event.target.closest('li')
                    this.listDatas.removeChild(liToRemove)
                }
            })
            this.listDatas.appendChild(card)
        }
    }
    async initialisePage(){
         await this.fetchDatas()
        this.fillList()
        this.setControls()
        this.setControlsForms()
    }
}
export default File;