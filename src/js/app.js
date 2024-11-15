/*======= MENU SHOW Y HIDDEN =======*/
const navMenu = document.querySelector('#nav-menu');
const navToggle = document.querySelector('#nav-toggle');
const navClose = document.querySelector('#nav-close');

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    })
}

/*==================== SHOW SCROLL UP ====================*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== FORM TO WHATSAPP ====================*/
function sendToWhatsapp() {
    let number = "+526143840053"

    let name = document.querySelector('#name').value;
    let email = document.querySelector('#email').value;
    let project = document.querySelector('#project').value;
    let message = document.querySelector('#message').value;

    let url = `https://wa.me/${number}?text=
    Name : ${name}%0a
    Email : ${email}%0a
    Project: ${project}%0a
    Message : ${message}%0a%0a`;
    
    window.open(url, '_blank').focus();
}

/*==================== FORM VALIDATION ====================*/
document.addEventListener('DOMContentLoaded', function() {
    const email = {
        name: '',
        email: '',
        project: '',
        message: '' 
    }

    //select interface items 
    const inputName = document.querySelector('#name');
    const inputEmail = document.querySelector('#email');
    const inputProject = document.querySelector('#project');
    const inputMessage = document.querySelector('#message');
    const form = document.querySelector('#form');
    const btnSubmit = document.querySelector('#form button[type="submit"]');

    //Assign events
    inputName.addEventListener('input', validar);
    inputEmail.addEventListener('input', validar);
    inputProject.addEventListener('input', validar);
    inputMessage.addEventListener('input', validar);

    form.addEventListener('submit', enviarEmail);


    //Functions
    function enviarEmail(e) {
        e.preventDefault();

        setTimeout(() => {

            resetFormulario();

            //Crear una alerta
            const alertaExito = document.createElement('P');
            alertaExito.classList.add('succed');

            alertaExito.textContent = 'Mensaje enviado correctamente'

            formulario.appendChild(alertaExito);

            setTimeout(() => {
                alertaExito.remove();
            }, 3000);
        }, 2000)
    }
    
    function validar(e) {
        if(e.target.value.trim() === '') {
            mostrarAlerta(`The ${e.target.id} field is required.`, e.target.parentElement);
            email[e.target.name] = '';
            comprobarEmail();
            return;
        } 

        if(e.target.id === 'email' && !validarEmail(e.target.value)) {
            mostrarAlerta('Invalid email.', e.target.parentElement)
            email[e.target.name] = '';
            comprobarEmail();
            return;
        };


        limpiarAlerta(e.target.parentElement);

        //Asignar los valores
        email[e.target.name] = e.target.value.trim().toLowerCase();
        
        //Comprobar el objeto de email
        comprobarEmail();
    }

    function mostrarAlerta(mensaje, referencia) { //*listo

        limpiarAlerta(referencia);

        //Generar 'alerta' en HTML 
        const error = document.createElement('P');
        error.textContent = mensaje;
        error.classList.add('contact__alert');

        //Inyectar 'error' a formulario
        referencia.appendChild(error);
    }

    function limpiarAlerta(referencia){ //*listo
        //Comprueba si ya existe una alerta
        const alerta = referencia.querySelector('.contact__alert');
        if(alerta) {
            alerta.remove();
        }
    }

    function comprobarEmail() { //*listo
        if(Object.values(email).includes('')) {
            btnSubmit.classList.add('opacity-50')
            btnSubmit.disabled = true;
            return;
        } 
        
        btnSubmit.classList.remove('opacity-50')
        btnSubmit.disabled = false;
    }

    function resetFormulario() { //*listo
        //reiciar el objeto
        email.name = '';
        email.email = '';
        email.project = '';
        email.message = '';
        
        form.reset();
        comprobarEmail();
    }

    function validarEmail(email) {
        //'expresion regular' para email en JS
        const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
        const resultado = regex.test(email)
        return resultado;
    }
});



/*==================== CAMBIAR IDIOMA ====================*/
const flagsElement = document.querySelector('#flags');
const textsToChange = document.querySelectorAll('[data-section]');
const inputName = document.querySelector('#name');
const inputEmail = document.querySelector('#email');
const inputMessage = document.querySelector('#message')

//Escuchar el cambio de checkbox y le cambia el data-language
flagsElement.addEventListener('change',(e)=> {
    if (e.target.checked) {
        flagsElement.setAttribute('data-language','esp')
        /* console.log(e.target.dataset.language); */
        changeLanguages(e.target.dataset.language);
        inputName.placeholder = 'Tu nombre';
        inputEmail.placeholder = 'Tu correo electrónico';
        inputMessage.placeholder = 'La descripción de tu proyecto';

    } else {
        flagsElement.setAttribute('data-language','eng')
        /* console.log(e.target.dataset.language); */
        changeLanguages(e.target.dataset.language);
        inputName.placeholder = 'Your name';
        inputEmail.placeholder = 'Your email';
        inputMessage.placeholder = 'Your project description';
    }
});


//Toma el json y modifica el idioma
const changeLanguages = async language => {
    const requestJson = await fetch(`./build/languages/${language}.json`);
    const texts = await requestJson.json();

    for( const textToChange of textsToChange) {
        const section = textToChange.dataset.section

        const value = textToChange.dataset.value

        textToChange.innerHTML = texts[section][value]
    }
}