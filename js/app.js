class GDPR {
  constructor () {
    this.bindEvents()
    if (this.cookieStatus() !== 'accept') this.showGDPR()
  }

  bindEvents () {
    const buttonAccept = document.querySelector('.gdpr-consent__button--accept')
    buttonAccept.addEventListener('click', () => {
      this.cookieStatus('accept')
      this.hideGDPR()
    })

    const buttonReject = document.querySelector('.gdpr-consent__button--reject') // student uitwerking
    buttonReject.addEventListener('click', () => {
      this.cookieStatus('reject')
      this.hideGDPR()
    })
  }

  cookieStatus (status) {
    if (status) {
      localStorage.setItem('gdpr-consent-choice', status)
      localStorage.setItem('gdpr-consent-metadata', this.getMetadataJSON()) // student uitwerking methode aanroepen
    }

    return localStorage.getItem('gdpr-consent-choice')
  }

  getMetadataJSON () { // student uitwerking methode met datum en tijd -     //'Date':'dd-mm-jjjj','Time:'hh:mm'
    const date = new Date()
    return JSON.stringify({ datum: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, tijd: `${date.getHours()}:${date.getMinutes()}` })
  }

  hideGDPR () {
    document.querySelector('.gdpr-consent').classList.add('hide')
    document.querySelector('.gdpr-consent').classList.remove('show')
  }

  showGDPR () {
    document.querySelector('.gdpr-consent').classList.add('show')
  }
}

const gdpr = new GDPR()

class Validation {
  constructor () {
    this.validationResults = {
      name: false,
      email: false,
      subject: false,
      message: false,
      captcha:false
    }


    this.setupEventListeners()
  }

  setupEventListeners () {
    const fields = ['name', 'subject', 'message']
    
    fields.forEach(field => {
      const item = document.getElementById(field) ?? null;
      if( item != null) item.addEventListener('input', () => {
        if (!item.checkValidity()) {
          item.reportValidity()
          this.validationResults[field] = false
        } else {
          item.setCustomValidity('')
          this.validationResults[field] = true
        }
        this.updateSendButton()
      })
    })

    const email = document.getElementById('email') ?? null;
    if( email != null) email.addEventListener('input', () => {
      if (!email.checkValidity()) {
        if (email.value.indexOf('@') === -1) {
          email.setCustomValidity(`Vul een geldig e-mail adres in van ${email.minLength} tot en met ${email.maxLength} karakters`)
        } else {
          email.setCustomValidity('')
        }
        email.reportValidity() 
        this.validationResults.email = false
      } else {
        email.setCustomValidity('')
        this.validationResults.email = true
      }
      this.updateSendButton()
    })
  }



  updateSendButton () {
    const sendButton = document.getElementById('sendButton')

    const isValid = Object.values(this.validationResults).every(result => result === true)
    if (isValid) {
      sendButton.removeAttribute('disabled')
    } else {
      sendButton.setAttribute('disabled', 'disabled')
    }
  }
}

const validation = new Validation()

function recaptchaCallback() {
  validation.validationResults.captcha = true;
  validation.updateSendButton()
}

const form = document.getElementById("contact-form") ?? null;
if(form != null) form.addEventListener("submit", sendMail);

async function sendMail(e) {
  e.preventDefault();

  const mail = {
    header:{
      sender: form.querySelector("#email").value,
      senderName: form.querySelector("#name").value
    },
    body:{
      subject: form.querySelector("#subject").value,
      message: form.querySelector("#message").value
    } 
  }
  form.reset();
  validation.validationResults = {
    name: false,
    email: false,
    subject: false,
    message: false
  }
  validation.updateSendButton();
  let result = "";
  try {
    result = await (await fetch(`http://localhost:5080/api/ContactVerzoek`, {
    method: "POST",
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': 're58oWajrf'
  },
  body: JSON.stringify(mail)
})).text();  } catch(error) {
    result = "Het verzenden is niet gelukt, probeer het later opnieuw";
  }
  let Tekstveld = document.querySelector("#Tekstveld")

  Tekstveld.innerHTML = result;

  document.querySelector('#Tekstveld').classList.remove('hide')

  
}