/*======= SHOW MENU =======*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId);

    toggle.addEventListener('click', () => {
        // Add show-menu class to nav menu
        nav.classList.toggle('show-menu');
        // Add show-icon to show and hide menu icon
        toggle.classList.toggle('show-icon');
    });
};

showMenu('navM-toggle', 'navM-menu');

/* ==== DATOS DE FORM A SHEETS ==== */
const scriptURL = 'https://script.google.com/macros/s/AKfycbwg35rfT3xEbPixWQTenjz8vMZDBnFgCaDXano1a4WrPzFByt8-xafUkB-xvTVJT3GKhw/exec';
const form = document.getElementById('contact-form');
const spinner = document.getElementById('spinner');
const spinnerAnimation = document.getElementById('spinner_animation');
const spinnerText = document.getElementById('spinner_text');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Muestra el spinner inmediatamente
    spinner.classList.remove('hidden');
    spinnerAnimation.classList.remove('hidden');

    try {
        // Enviar los datos del formulario
        const response = await fetch(scriptURL, { 
            method: 'POST', 
            body: new FormData(form) 
        });

        if (response.ok) {
            mostrarMensajeExito();
        } else {
            throw new Error('Error al enviar los datos.');
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error.message);
        mostrarMensajeError();
    }
});

/* ==== Función para mostrar mensaje de éxito ==== */
function mostrarMensajeExito() {
    spinnerAnimation.classList.add('hidden');
    form.reset();

    spinnerText.classList.remove('hidden');
    spinnerText.textContent = "¡Gracias por contactarnos! Tus datos han sido enviados.";

    setTimeout(() => {
        spinnerText.classList.add('hidden');
        spinner.classList.add('hidden');
    }, 3000);
}

/* ==== Función para mostrar mensaje de error ==== */
function mostrarMensajeError() {
    spinnerAnimation.classList.add('hidden'); // Oculta la animación del spinner

    spinnerText.classList.remove('hidden'); // Muestra el texto del spinner
    spinnerText.textContent = "Ocurrió un error al enviar los datos. Por favor, inténtalo de nuevo.";
    spinnerText.style.backgroundColor = "#dc2626"; // Cambia el fondo del mensaje a rojo
    spinnerText.style.color = "white"; // Asegura que el texto sea legible con contraste

    setTimeout(() => {
        spinnerText.classList.add('hidden'); // Oculta el mensaje después de 3 segundos
        spinner.classList.add('hidden'); // Oculta el spinner completo
        spinnerText.style.backgroundColor = ""; // Resetea el fondo del mensaje
        spinnerText.style.color = ""; // Resetea el color del texto
    }, 3000);
}
