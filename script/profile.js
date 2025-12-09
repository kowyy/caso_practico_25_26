document.addEventListener("DOMContentLoaded", () => {
    
    // Verificamos si hay sesión iniciada
    const username = localStorage.getItem("site_username") || sessionStorage.getItem("site_username");
    
    // Si no está logueado, lo mandamos fuera
    if (!username) {
        window.location.href = "signup.html";
        return;
    }

    // Referencias a los elementos
    const nameDisplay = document.getElementById("profile-name");
    const emailDisplay = document.getElementById("user-email-display");
    const bioInput = document.getElementById("user-bio");
    const picDisplay = document.getElementById("profile-pic");
    const logoutBtn = document.getElementById("btn-logout");
    
    // Elementos para el cambio de imagen
    const changeAvatarBtn = document.getElementById("btn-change-avatar");
    const avatarInput = document.getElementById("avatar-upload");
    
    // Campos de información
    const fullnameInput = document.getElementById("user-fullname");
    const emailInput = document.getElementById("user-email");
    const phoneInput = document.getElementById("user-phone");
    const countrySelect = document.getElementById("user-country");

    // Ponemos el nombre del usuario
    nameDisplay.textContent = username;
    
    // Cargamos la foto guardada o ponemos una por defecto
    const savedAvatar = localStorage.getItem("site_user_avatar");
    if (savedAvatar) {
        picDisplay.src = savedAvatar;
    } else {
        picDisplay.src = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
    }

    // Cargar y mostrar email
    const savedEmail = localStorage.getItem("site_user_email_" + username);
    if (savedEmail) {
        emailInput.value = savedEmail;
        emailDisplay.textContent = savedEmail;
    } else {
        // Generar email automático
        const generatedEmail = `${username.toLowerCase().replace(/\s/g, '')}@example.com`;
        emailInput.value = generatedEmail;
        emailDisplay.textContent = generatedEmail;
        localStorage.setItem("site_user_email_" + username, generatedEmail);
    }

    // Cargar otros campos
    const savedFullname = localStorage.getItem("site_user_fullname_" + username);
    const savedPhone = localStorage.getItem("site_user_phone_" + username);
    const savedCountry = localStorage.getItem("site_user_country_" + username);

    if (savedFullname) fullnameInput.value = savedFullname;
    if (savedPhone) phoneInput.value = savedPhone;
    if (savedCountry) countrySelect.value = savedCountry;

    // Auto-guardar campos
    fullnameInput.addEventListener("input", () => {
        localStorage.setItem("site_user_fullname_" + username, fullnameInput.value);
    });
    
    phoneInput.addEventListener("input", () => {
        localStorage.setItem("site_user_phone_" + username, phoneInput.value);
    });
    
    countrySelect.addEventListener("change", () => {
        localStorage.setItem("site_user_country_" + username, countrySelect.value);
    });

    // Lógica para cambiar la foto de perfil
    changeAvatarBtn.addEventListener("click", () => {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const newImageBase64 = event.target.result;
                picDisplay.src = newImageBase64;
                
                try {
                    localStorage.setItem("site_user_avatar", newImageBase64);
                } catch (error) {
                    alert("La imagen es muy grande, intenta con una más pequeña.");
                }
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Cerrar sesión
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("site_username");
        localStorage.removeItem("site_user_avatar");
        sessionStorage.removeItem("site_username");
        window.location.href = "index.html";
    });

    // Sistema de tabs
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.dataset.tab;
            
            // Remover active de todos
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Activar el seleccionado
            item.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
        });
    });

    // Verificar si hay un parámetro de URL para abrir una tab específica
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
        const targetNav = document.querySelector(`[data-tab="${tabParam}"]`);
        if (targetNav) {
            targetNav.click();
        }
    }

    // Cargar reservas
    function cargarReservas() {
        const reservasContainer = document.getElementById('reservas-container');
        const reservas = JSON.parse(localStorage.getItem(`reservas_${username}`) || '[]');
        
        if (reservas.length === 0) {
            reservasContainer.innerHTML = '<p class="empty-state">No tienes reservas aún. <a href="destinos-destacados.html" style="color: #000; font-weight: 600;">Explora destinos</a></p>';
            return;
        }
        
        reservasContainer.innerHTML = '';
        
        reservas.reverse().forEach(reserva => {
            const card = document.createElement('div');
            card.className = 'reserva-card';
            
            card.innerHTML = `
                <img src="${reserva.imagen}" alt="${reserva.destino}">
                <div class="reserva-info">
                    <div class="reserva-header">
                        <h4>${reserva.destino}</h4>
                        <span class="reserva-badge">${reserva.estado}</span>
                    </div>
                    <p><strong>Fecha de reserva:</strong> ${reserva.fecha}</p>
                    <p><strong>Titular:</strong> ${reserva.titular.nombre}</p>
                    <p><strong>Email:</strong> ${reserva.titular.email}</p>
                    <p><strong>Acompañantes:</strong> ${reserva.acompañantes.length}</p>
                    ${reserva.mascota ? `<p><strong>Mascota:</strong> ${reserva.mascota.tipo} (${reserva.mascota.tamaño})</p>` : ''}
                    <p class="reserva-precio">${reserva.precio}</p>
                    <button class="btn-cancel-reserva" data-id="${reserva.id}">Cancelar reserva</button>
                </div>
            `;
            
            reservasContainer.appendChild(card);
        });

        // Event listeners para cancelar
        document.querySelectorAll('.btn-cancel-reserva').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
                    const reservasActualizadas = reservas.filter(r => r.id !== id);
                    localStorage.setItem(`reservas_${username}`, JSON.stringify(reservasActualizadas));
                    cargarReservas();
                }
            });
        });
    }

    // Cargar reseñas
    function cargarReseñas() {
        const reseñasContainer = document.getElementById('reseñas-container');
        const reseñas = JSON.parse(localStorage.getItem(`user_reviews_${username}`) || '[]');
        
        if (reseñas.length === 0) {
            reseñasContainer.innerHTML = '<p class="empty-state">No has escrito reseñas aún. <a href="destinos-destacados.html" style="color: #000; font-weight: 600;">Visita un destino</a></p>';
            return;
        }
        
        reseñasContainer.innerHTML = '';
        
        reseñas.reverse().forEach((review, index) => {
            const card = document.createElement('div');
            card.className = 'reseña-card';
            
            const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
            
            card.innerHTML = `
                <div class="reseña-header">
                    <div>
                        <h4>${review.destinoNombre}</h4>
                        <p class="reseña-location">${review.destinoPais}</p>
                    </div
                <span class="reseña-stars">${stars}</span>
                </div>
                <p class="reseña-text">${review.text}</p>
                <p class="reseña-date">Escrita el ${review.fecha}</p>
                <button class="btn-delete-review" data-index="${index}">Eliminar reseña</button>
            `;
            
            reseñasContainer.appendChild(card);
        });

        // Event listeners para eliminar
        document.querySelectorAll('.btn-delete-review').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
                    reseñas.splice(reseñas.length - 1 - index, 1);
                    localStorage.setItem(`user_reviews_${username}`, JSON.stringify(reseñas));
                    cargarReseñas();
                }
            });
        });
    }

    // Cargar datos iniciales
    cargarReservas();
    cargarReseñas();
});
