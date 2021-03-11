import Vue from 'vue';
let dateFrRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
let dateEnRegex = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^-])[A-Za-z\d@$!%*?&#^-]{7,20}$/;
let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const rules = Vue.observable({
    valid: true,
    dateFrRules: [
        (v: any) => !!v || "Veuillez remplir le champ",
        (v: any) => (v && v.match(dateFrRegex) != null) || "La date (FR) n'est pas au bon format",
    ],
    dateEnRules: [
        (v: any) => !!v || "Veuillez remplir le champ",
        (v: any) => (v && v.match(dateEnRegex) != null) || "La date (EN) n'est pas au bon format",
    ],
    emailRules: [
        (v: any) => !!v || "Veuillez remplir le champ",
        (v: any) => (v && v.match(emailRegex) != null) ||"L'email n'est pas au bon format",
    ],
    passwordRules: [
        (v: any) => !!v || "Veuillez remplir le champ",
        (v: any) => (v && v.match(passwordRegex) != null) || "Le mot de passe n'est pas au bon format",
        (v: any) => (v && v.length >= 7 && v.length <= 20) || "Mot de passe doit contenir entre 7 et 20 caractères",
    ],
    textRules: [
        (v: any) => !!v || "Veuillez remplir le champ",
        (v: any) => (v && v.match(/^[a-zA-Z]*$/) != null) || "Seuls les lettres sont autorisé",
    ],
    caractereRules: [
        (v: any) => !!v || "Veuillez remplir le champ",
        (v: any) => (v && v.match(/^[^@"()/!_$*€£`+=;?#]+$/) != null) || "Le texte n'est pas au bon format",
        (v: any) => (v && v.length >= 2 && v.length <= 25) || "Le texte doit contenir entre 2 et 25 caractères",
    ],
    contentRules:[        
        (v: any) => !!v || "Veuillez remplir le champ",
        (v: any) => (v && v.length >= 1 && v.length <= 200) || "Le texte est trop long",
    ],
    numericRules: [
        (v: any) => !!v || "Veuillez remplir le champ",
        (v: any) => (v && v.match(/^[0-9]+$/) != null) || "Seuls les chiffres sont autorisé",
    ],
    champRules: [(v: any) => !!v || "Veuillez remplir le champ"]
});