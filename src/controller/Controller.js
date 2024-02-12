class Controller{
    constructor(){
        if (new.target === Controller){
            throw new Error("Celtte classe ne peut être instanciée directement")   
        }
    }
    // InitialisePage est une methode abstraite qui devra être surchargée par tous les controllers de l'application et invoquée uniquement par le Controller centrale
    initialisePage(){
        throw new Error("Cette methode doit être surchargée!")
    }
}
export default Controller;