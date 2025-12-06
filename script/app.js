document.addEventListener('DOMContentLoaded', () => {
    
    // Sistema de login con modal
    const loginBtn = document.getElementById('btn-login');
    const modal = document.getElementById('login-modal');
    
    if (loginBtn && modal) {
        const closeModal = document.getElementById('close-modal');
        const loginForm = document.getElementById('login-form');
        
        // Ver si ya hay sesión activa
        const savedUser = localStorage.getItem('site_username');
        if (savedUser) {
            loginBtn.textContent = `Hola, ${savedUser}`;
            loginBtn.disabled = true; 
        }

        // Abrir modal
        loginBtn.addEventListener('click', () => {
            if (!loginBtn.disabled) modal.showModal();
        });
        
        // Cerrar modal
        closeModal.addEventListener('click', () => modal.close());

        // Procesar login
        loginForm.addEventListener('submit', () => {
            const username = document.getElementById('username').value;
            const remember = document.getElementById('remember-me').checked;

            // Guardar según preferencia
            if (remember) {
                localStorage.setItem('site_username', username);
            } else {
                sessionStorage.setItem('site_username', username);
            }
            
            alert(`Bienvenido/a, ${username}`);
            loginBtn.textContent = `Hola, ${username}`;
            loginBtn.disabled = true;
        });
    }

    // Sistema de registro
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(signupForm);
            const username = formData.get('username');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirm-password');
            
            // Validar contraseñas
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }
            
            console.log(`Registrando usuario: ${username}`);
            alert('Cuenta creada correctamente. Redirigiendo...');
            
            window.location.href = 'index.html';
        });
    }
});
