class GDPR {

    constructor() {
        this.bindEvents();
        if(this.cookieStatus() !== 'accept') this.showGDPR();
    }

    bindEvents() {
        let buttonAccept = document.querySelector('.gdpr-consent__button--accept');
        buttonAccept.addEventListener('click', () => {
            this.cookieStatus('accept');
            this.hideGDPR();
        });

        let buttonReject = document.querySelector('.gdpr-consent__button--reject');  //student uitwerking
        buttonReject.addEventListener('click',()=>{
            this.cookieStatus('reject');
            this.hideGDPR();
        });

    }

    cookieStatus(status) {

        if (status) 
        {
            localStorage.setItem('gdpr-consent-choice', status);
            localStorage.setItem('gdpr-consent-metadata',this.getMetadataJSON());    //student uitwerking methode aanroepen
        }

        return localStorage.getItem('gdpr-consent-choice');
    }

    
    getMetadataJSON(){    //student uitwerking methode met datum en tijd -     //'Date':'dd-mm-jjjj','Time:'hh:mm'
        let date = new Date();
        return JSON.stringify({ datum: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`, tijd: `${date.getHours()}:${date.getMinutes()}` })
    }

    
    hideGDPR(){
        document.querySelector(`.gdpr-consent`).classList.add('hide');
        document.querySelector(`.gdpr-consent`).classList.remove('show');
    }

    showGDPR(){
        document.querySelector(`.gdpr-consent`).classList.add('show');
    }

}

const gdpr = new GDPR();

class Validation {
    constructor() {
        this.validationResults = {
            firstname: false,
            lastname: false,
            phone_number: false,
            email: false,
            subject: false,
            message: false,
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        const fields = ["firstname", "lastname", "phone_number", "subject", "message"];

        fields.forEach(field => {
            const item = document.getElementById(field);
            item.addEventListener("input", () => {
                if (!item.checkValidity()) {
                    item.reportValidity();
                    this.validationResults[field] = false;
                } else {
                    item.setCustomValidity("");
                    this.validationResults[field] = true;
                }
                this.updateSendButton();
            });
        });

        // Email validation logic using browser's built-in validation
        const email = document.getElementById("email");
        email.addEventListener("input", () => {
            if (!email.checkValidity()) {
                if (email.value.indexOf('@') === -1) {
                    email.setCustomValidity(`Vul een geldig e-mail adres in van ${email.minLength} tot en met ${email.maxLength} karakters`);
                } else {
                    email.setCustomValidity("");
                }
                email.reportValidity();  // Explicitly call reportValidity to show the custom validity message
                this.validationResults.email = false;
            } else {
                email.setCustomValidity("");
                this.validationResults.email = true;
            }
            this.updateSendButton();
        });
    }

    /* checks if the button can be enabled */
    updateSendButton() {
        let sendButton = document.getElementById("sendButton");

        // Enable the button if all conditions are true, otherwise disable it
        const isValid = Object.values(this.validationResults).every(result => result === true);
        if (isValid) {
            sendButton.removeAttribute("disabled");
        } else {
            sendButton.setAttribute("disabled", "disabled");
        }
    }
}

const validation = new Validation();
