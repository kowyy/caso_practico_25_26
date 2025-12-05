document.addEventListener('DOMContentLoaded', () => {
    
    // Referencias específicas para el sistema de Login (Modal)
    // Usamos chequeos de nulidad para que el script no rompa en la página de registro
    const loginBtn = document.getElementById('btn-login');
    const modal = document.getElementById('login-modal');
    
    if (loginBtn && modal) {
        const closeModal = document.getElementById('close-modal');
        const loginForm = document.getElementById('login-form');
        
        // Comprobar si hay sesión activa en localStorage
        const savedUser = localStorage.getItem('site_username');
        if (savedUser) {
            loginBtn.textContent = `Hola, ${savedUser}`;
            loginBtn.disabled = true; 
        }

        // Abrir modal solo si no está logueado
        loginBtn.addEventListener('click', () => {
            if (!loginBtn.disabled) modal.showModal();
        });
        
        closeModal.addEventListener('click', () => modal.close());

        // Procesar formulario de login
        loginForm.addEventListener('submit', () => {
            const username = document.getElementById('username').value;
            const remember = document.getElementById('remember-me').checked;

            // Decidir tipo de persistencia según preferencia del usuario
            if (remember) {
                localStorage.setItem('site_username', username);
            } else {
                sessionStorage.setItem('site_username', username);
            }
            alert(`Bienvenido/a, ${username}`);
        });
    }

    // Referencias para la página de Registro
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extraer datos del formulario
            const formData = new FormData(signupForm);
            const username = formData.get('username');
            
            // Simular petición asíncrona al backend
            console.log(`Creando nuevo usuario: ${username}`);
            alert('Cuenta creada correctamente. Redirigiendo...');
            
            // Retorno a la landing page
            window.location.href = 'index.html';
        });
    }
});
