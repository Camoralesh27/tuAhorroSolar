/*======= SHOW MENU =======*/
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId)
 
    toggle.addEventListener('click', () =>{
        // Add show-menu class to nav menu
        nav.classList.toggle('show-menu')
        // Add show-icon to show and hide menu icon
        toggle.classList.toggle('show-icon')
    })
 }
 
 showMenu('navM-toggle','navM-menu');


 /* ==== DATOS DE FORM A SHEETS ==== */
 const scriptURL = 'https://script.google.com/macros/s/AKfycbwg35rfT3xEbPixWQTenjz8vMZDBnFgCaDXano1a4WrPzFByt8-xafUkB-xvTVJT3GKhw/exec';

 const form = document.forms['contact-form'];
 
 form.addEventListener('submit', e => {
     e.preventDefault(); // Evita que el formulario recargue la página
     fetch(scriptURL, { method: 'POST', body: new FormData(form) })
         .then(response => {
             if (response.ok) {
                 alert("¡Gracias por contactarnos! Tus datos han sido enviados. Un asesor se pondrá en contacto contigo.");
                 form.reset(); // Limpia el formulario después del envío
             } else {
                 throw new Error('Error al enviar los datos.');
             }
         })
         .catch(error => console.error('Error al enviar el formulario:', error.message));
 });
 



/* const scriptURL = 'https://script.google.com/macros/s/AKfycbwg35rfT3xEbPixWQTenjz8vMZDBnFgCaDXano1a4WrPzFByt8-xafUkB-xvTVJT3GKhw/exec';

const form = document.forms['contact-form'];

form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL,{ method: 'POST', body: new FormData(form)})
    .then(response => alert("¡Gracias por contactarnos! Tus datos han sido enviados. Un asesor se pondrá en contacto contigo."))
    .then(error => console.error('Error!', error.message));
} */