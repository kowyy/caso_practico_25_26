document.addEventListener('DOMContentLoaded', () => {
    
    // Header
    const headerRight = document.querySelector('.header-right');
    const savedUser = localStorage.getItem('site_username') || sessionStorage.getItem('site_username');
    const savedAvatar = localStorage.getItem('site_user_avatar');

    if (savedUser && headerRight) {
        
        // Avatar por defecto si no subió imagen
        const avatarSrc = savedAvatar || `https://ui-avatars.com/api/?name=${savedUser}&background=0D8ABC&color=fff`;

        headerRight.innerHTML = `
            <a href="#" class="nav-link" data-i18n="faq">FAQ</a>
            <a href="#" class="nav-link" data-i18n="help">Ayuda</a>
            
            <div class="user-menu-item" style="display: flex; align-items: center; gap: 10px; margin-left: 10px;">
                <a href="mi-perfil.html" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
                    <img src="${avatarSrc}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd;">
                    <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${savedUser}</span>
                </a>
                <button id="btn-logout-header" class="btn-text" style="color: #dc3545; font-size: 0.85rem; margin-left: 5px;">Salir</button>
            </div>
        `;

        // Lógica de Logout en el nuevo botón generado
        document.getElementById('btn-logout-header').addEventListener('click', () => {
            localStorage.removeItem('site_username');
            localStorage.removeItem('site_user_avatar');
            sessionStorage.removeItem('site_username');
            window.location.reload(); // Recargar para volver al estado inicial
        });
    } else {
        initLoginModal();
    }


    // Sistem de login
    function initLoginModal() {
        const loginBtn = document.getElementById('btn-login');
        const modal = document.getElementById('login-modal');
        
        if (loginBtn && modal) {
            const closeModal = document.getElementById('close-modal');
            const loginForm = document.getElementById('login-form');

            loginBtn.addEventListener('click', () => modal.showModal());
            closeModal.addEventListener('click', () => modal.close());

            loginForm.addEventListener('submit', (e) => {
                // Prevenir recarga por defecto para procesar datos
                // e.preventDefault(); Dejamos que el form fluya o lo controlamos manualmente
                const username = document.getElementById('username').value;
                const remember = document.getElementById('remember-me').checked;

                if (remember) {
                    localStorage.setItem('site_username', username);
                } else {
                    sessionStorage.setItem('site_username', username);
                }
                
                // Redirigir a index.html tras login exitoso
                window.location.href = 'index.html';
            });
        }
    }


    // Registro con imagen
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm').value;
            const fileInput = document.getElementById('reg-avatar');
            
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            const finalizarRegistro = () => {
                localStorage.setItem('site_username', username);
                alert('¡Cuenta creada! Redirigiendo al inicio...');
                window.location.href = 'index.html';
            };

            // Procesar imagen si existe
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Guardamos la imagen en Base64 en localStorage
                    try {
                        localStorage.setItem('site_user_avatar', e.target.result);
                        finalizarRegistro();
                    } catch (error) {
                        alert("La imagen es demasiado grande para guardarla en el navegador. Intenta con una más pequeña.");
                        console.error("QuotaExceededError", error);
                    }
                };
                
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                // Si no hay imagen, registrar sin avatar (usará el predeterminado)
                finalizarRegistro();
            }
        });
    }
});
