// src/scripts/contact-form.js
import emailjs from '@emailjs/browser';

// Obtener variables de entorno
const PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;

// Verificar que las variables de entorno estén definidas
if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    console.error('Faltan variables de entorno de EmailJS. Verifica tu archivo .env');
    console.error('Variables requeridas: PUBLIC_EMAILJS_PUBLIC_KEY, PUBLIC_EMAILJS_SERVICE_ID, PUBLIC_EMAILJS_TEMPLATE_ID');
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar EmailJS
    emailjs.init(PUBLIC_KEY);
    
    // Obtener elementos del DOM
    const form = document.querySelector('#contact-form');
    const sendBtn = document.querySelector('button');
    const statusMessage = document.querySelector('.error-message');
    console.log(statusMessage)

    // Verificar que los elementos existan
    /*
    if (!form || !sendBtn || !statusMessage) {
        console.error('No se pudieron encontrar los elementos del formulario');
        return;
    }
    */

    // Función para mostrar mensajes de estado
    function showMessage(message, isError = false) {
        statusMessage.textContent = message;
        //Comprueba que el error sea true y le da la clase error
        isError ?  statusMessage.classList.toggle("error") : statusMessage.classList.toggle("successful")
        
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
            statusMessage.textContent = '';
            isError ?  statusMessage.classList.toggle("error") : statusMessage.classList.toggle("successful")
        }, 5000);
    }

    // Función para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Manejar envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Verificar variables de entorno antes de enviar
        if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
            showMessage('Error de configuración. Contacta al administrador.', true);
            return;
        }

        // Obtener datos del formulario
        const formData = new FormData(form);
        const email = formData.get('user_email');
        const message = formData.get('message');

        // Validaciones adicionales
        if (!email || !message || email === '' || message === '') {
            showMessage('Por favor completa todos los campos.', true);
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Por favor ingresa un email válido.', true);
            return;
        }

        if (message.trim().length < 10) {
            showMessage('El mensaje debe tener al menos 10 caracteres.', true);
            return;
        }

        // Cambiar estado del botón
        const originalText = sendBtn.textContent;
        sendBtn.textContent = 'Enviando...';
        sendBtn.disabled = true;

        try {
            // Enviar email usando EmailJS
            const result = await emailjs.sendForm(
                SERVICE_ID,
                TEMPLATE_ID,
                form
            );

            showMessage('¡Mensaje enviado correctamente!');
            
            // Limpiar formulario
            form.reset();

        } catch (error) {
            console.error('Error al enviar email:', error);
            
            // Mostrar mensaje de error más específico
            let errorMessage = 'Error al enviar el mensaje. Inténtalo de nuevo.';
            
            if (error.status === 400) {
                errorMessage = 'Error en los datos del formulario.';
            } else if (error.status === 401) {
                errorMessage = 'Error de autenticación. Contacta al administrador.';
            } else if (error.status === 402) {
                errorMessage = 'Servicio temporalmente no disponible.';
            }
            
            showMessage(errorMessage, true);
            
        } finally {
            // Restaurar estado del botón
            sendBtn.textContent = originalText;
            sendBtn.disabled = false;
        }
    });
});