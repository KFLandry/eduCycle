import Controller from "./Controller.js";
import ItemManager from "../model/Manager/ItemManager.js";
import User from "../model/Factory/User.js";

export class Don extends Controller {
    constructor() {
        super();
        debugger
        this.uniqueUser = User.getUniqueInstance();
        this.itemManager = new ItemManager();
        this.inputPhotos = document.querySelector('input[name="photos"]');
        this.inputFindResidence = document.querySelector('input[name="findResidence"]');
        this.listPhotos = document.querySelector('ul#listPhotos');
        this.form = document.querySelector(`form`);
        this.btnPublished = document.querySelector('button[name="submit"]');
        this.card = {}
    }
    async addPhoto() {
        this.listPhotos.innerHTML = "";
        const cardString = await fetch("src/template/Component/cardImage.html").then(response => response.text()).catch(e => console.log(e));
        const parser = new DOMParser();
        this.card = parser.parseFromString(cardString, "text/html");
        this.inputPhotos.addEventListener("change", () => {
            for (const image of this.inputPhotos.files) {
                debugger
                const cardImage = this.card.querySelector("li").cloneNode(true);
                cardImage.id = image.name;
                const imageNode = cardImage.querySelector('img#photo');
                //On recupere,lie et affiche l'image dan une liste
                const reader = new FileReader()
                reader.onload = (event)=>{
                    console.log(event.target.result)
                    imageNode.src = event.target.result
                }
                reader.readAsDataURL(image)
                //On ajoute l'event supprimer 
                const btnRemoveImage = cardImage.querySelector("#delete");
                btnRemoveImage.addEventListener('click', () => {
                    this.inputPhotos.files = this.listPhotos.filter(img => img === image);
                    this.listPhotos.removeChild(image.name);
                });
                // 
                this.listPhotos.appendChild(cardImage);
            }
        });
    }
    findResidence() {
        document.addEventListener('DOMContentLoaded', function () {
        var autocomplete = new google.maps.places.Autocomplete(this.inputFindResidence, { 
        types: ['geocode'],
        componentRestrictions: { country: 'fr' }
        }); 
        autocomplete.addListener('place_changed', function () { 
        var near_place = autocomplete.getPlace(); 
        });
    });
    }
    uploadImage(idItem) {
        try{
            const data =  {}
            for (const file of this.inputPhotos.files){
                data['idUser'] = this.uniqueUser.getId()
                data['idItem'] =  idItem
                data['name'] = file.name
                data['location'] =  file
            }
            this.itemManager.uploadImages(this.uniqueUser.getHeader(), data);
        }catch(e){
            throw new TypeError(`L'insertion a echoué : Detail : ${e} `);
        }
    }
    publishedAd() {
        // On récupere ,trie et  securise les datas avant l'insertion sur le serveur
        const formData = new FormData(this.form);
        const secureData = {};
        const category = [];
        const checkBoxValues = document.querySelectorAll('input[type="checkbox"]');
        // 
        formData.forEach((val, key) => {
            const input = this.form.querySelector(`[name="${key}"]`);
            if (input.getAttribute('type') !== "checkbox" && input.getAttribute('name') !== "findResidence" && input.getAttribute('name') !== 'photos') {
                secureData[key] = encodeURIComponent(val);
            }
        });
        checkBoxValues.forEach(input => {
            if (input.checked) {
                if (input.id = "other") {
                    const inputOther = document.querySelector('input[name="otherSerie"]');
                    series.push(encodeURIComponent(inputOther.value));
                }
                series.push(input.value);
            }
        });
        secureData['category'] = category;
        debugger
        //Les images sont sauvées
        try{
            this.uploadImage();
            this.itemManager.saveAd(this.uniqueUser.getHeader(), secureData);
            const result = this.itemManager.getData()
            this.uploadImage(result.data.id);
               
            // Redirection Vers la page d'acceuil
            window.location.href = "/";
        }catch(e){
            throw new TypeError(e)
            // window.location.href ="/503"
        }
   
    }
    addOtherSerie() {
        const checkOther = document.querySelector("input#other");
        checkOther.addEventListener('change', () => {
            const inputOther = document.querySelector('input#otherSerie');
            if (inputOther.display === "none") {
                inputOther.display = 'block';
            } else {
                inputOther.display = 'none';
            }
        });
    }
    initialisePage() {
        this.addPhoto();
        this.addOtherSerie();
        // this.findResidence()
        this.btnPublished.addEventListener('click',(event) =>{
            debugger
            event.preventDefault()
            this.publishedAd()
        });
    }
}
export default Don