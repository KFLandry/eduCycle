import Controller from "./Controller.js";
import ItemManager from "../model/Manager/ItemManager.js";
import User from "../model/Factory/User.js";
import { handleLocation } from "../public/router.js";

export class Don extends Controller {
    constructor() {
        super();
        this.result ={}
        debugger
        this.uniqueUser = User.getUniqueInstance();
        this.itemManager = new ItemManager();
        this.inputPhotos = document.querySelector('input[name="photos"]');
        this.inputFindResidence = document.querySelector('input[name="findResidence"]');
        this.listPhotos = document.querySelector('ul#listPhotos');
        this.form = document.querySelector(`form`);
        this.formFile = document.querySelector('form#formFile')
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
                const cardImage = this.card.querySelector("li").cloneNode(true);
                cardImage.id = image.name;
                const imageNode = cardImage.querySelector('img#photo');
                //On recupere,lie et affiche l'image dan une liste
                const reader = new FileReader()
                reader.onload = (event)=>{
                    imageNode.src = event.target.result
                }
                reader.readAsDataURL(image)
                //On ajoute l'event supprimer 
                const btnRemoveImage = cardImage.querySelector("#delete");
                btnRemoveImage.addEventListener('click', (event) => {
                    const liToRemove =  event.target.closest('li')
                    this.listPhotos.removeChild(liToRemove);
                    const filteredFiles = Array.from(this.inputPhotos.files).filter(img => img.name !== image.name);
                    // Créer une nouvelle FileList à partir des fichiers filtrés
                    const newFileList = new DataTransfer();
                    filteredFiles.forEach(file => newFileList.items.add(file));
                    // Assigner la nouvelle FileList à inputPhotos.files
                    this.inputPhotos.files = newFileList.files;
                });
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
    uploadImage() {
        try{
            debugger
            const data = new FormData(this.formFile)
            // L'id utilisateur
            data.append('idUser',this.uniqueUser.getId())
            const headers  =  this.uniqueUser.getHeaders()
            this.itemManager.uploadImages("", data);
        }catch(e){
            throw new TypeError(`L'insertion a echoué : Détails : ${e} `);
        }
    }
    publishedAd() {
        // On récupere ,trie et  sécurisé les datas avant l'insertion sur le serveur
        const formData = new FormData(this.form);
        const category = [];
        const checkBoxValues = document.querySelectorAll('input[type="checkbox"]');
        checkBoxValues.forEach(input => {
            if (input.checked) {
                if (input.id === "other") {
                    const inputOther = document.querySelector('input[name="otherSerie"]');
                    category.push(encodeURIComponent(inputOther.value));
                }
                category.push(input.value);
            }
        });
        formData.append('category',category)
        for( const file of this.inputPhotos.files){
            formData.append('files[]', file)
        }
        try{
            this.itemManager.saveAd(formData);
            // Redirection Vers la page d'acceuil
            if (this.itemManager.getData().statut === 1 ){
                const href = target.getAttribute('/');
                handleLocation()
            }
        }catch(e){
            const href = target.getAttribute('503');
            handleLocation()
            throw new TypeError(e)
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
        this.btnPublished.addEventListener('click',(event) =>{
            event.preventDefault()
            this.publishedAd()
        });
    }
}
export default Don