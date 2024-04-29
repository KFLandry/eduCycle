import { APITOKEN, EMAILTEST } from "../../public/ressource/secret"
// import {Email} from "../../../node_modules/smtpjs/smtp.js"

class CustomEmail{
    // send(what,to, link){
    //     let stringTemplate =  fetch(`src/template/EmailTemplate/${what}.html`).then( (resp) => resp.text())
    //     let parser = new DOMParser()
    //     let DOMTemplate =  parser.parseFromString(stringTemplate)
    //     DOMTemplate.querySelector("a#link").href = link    
    //     Email.send({
    //         SecureToken : APITOKEN,
    //         To : to,
    //         From : EMAILTEST,
    //         Subject : DOMTemplate.querySelector("#subject").textContent,
    //         Body : DOMTemplate.body
    //     }).then(message => message)
    //    ;
    // }
    // sendWithEmailJS(what,to, link, firstName="",){
    //     var templateParams = {
    //         name: firstName,
    //         to_email : to,
    //         link :link
    //         };
    //         emailjs.send('service_v4093qe', 'template_obp98c8', templateParams)
    //                 .then(
    //                     () => {
    //                         alert('Un mail de verification vous a été envoyé📧')
    //                 },
    //                 (error) => {
    //                     throw error(JSON.stringify(error))
    //                 },
    //         );
    // }
}
  
export default CustomEmail