// Helper estático para gestión CRUD de cookies y almacenamiento local simulado
const CookieAuth = {
    set(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    },
    
    get(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    },
    
    delete(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    },
    
    // Simula una base de datos de usuarios almacenada en una sola cookie JSON
    getUsers() {
        const data = this.get('database_users');
        return data ? JSON.parse(data) : [];
    },
    
    saveUsers(users) {
        this.set('database_users', JSON.stringify(users));
    }
};

document.addEventListener("DOMContentLoaded", () => {
    
    // Verificación de sesión: redirige al login si no hay cookie de usuario
    const username = CookieAuth.get("site_username");
    
    if (!username) {
        window.location.href = "signup.html";
        return;
    }

    const usersDB = CookieAuth.getUsers();
    const currentUser = usersDB.find(u => u.username === username);

    // Referencias a elementos del DOM para manipulación directa
    const nameDisplay = document.getElementById("profile-name");
    const emailDisplay = document.getElementById("user-email-display");
    const picDisplay = document.getElementById("profile-pic");
    const logoutBtn = document.getElementById("btn-logout");
    
    const changeAvatarBtn = document.getElementById("btn-change-avatar");
    const avatarInput = document.getElementById("avatar-upload");
    
    const fullnameInput = document.getElementById("user-fullname");
    const emailInput = document.getElementById("user-email");
    const phoneInput = document.getElementById("user-phone");
    const countrySelect = document.getElementById("user-country");

    nameDisplay.textContent = username;
    
    // Carga de avatar: Prioriza datos del usuario, luego cookie específica, finalmente fallback a API externa
    let avatarSrc;
    if (currentUser && currentUser.avatar) {
        avatarSrc = currentUser.avatar;
    } else {
        avatarSrc = CookieAuth.get("site_user_avatar") || 
                   `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
    }
    picDisplay.src = avatarSrc;

    // Gestión del email con fallback algorítmico si no existe en la DB
    let userEmail = "";
    if (currentUser && currentUser.email) {
        userEmail = currentUser.email;
    } else {
        userEmail = CookieAuth.get("site_user_email_" + username) || 
                    `${username.toLowerCase().replace(/\s/g, '')}@example.com`;
    }
    
    emailInput.value = userEmail;
    emailDisplay.textContent = userEmail;

    // Recuperación de preferencias de usuario guardadas previamente
    const savedFullname = CookieAuth.get("site_user_fullname_" + username);
    const savedPhone = CookieAuth.get("site_user_phone_" + username);
    const savedCountry = CookieAuth.get("site_user_country_" + username);

    if (savedFullname) fullnameInput.value = savedFullname;
    if (savedPhone) phoneInput.value = savedPhone;
    if (savedCountry) countrySelect.value = savedCountry;

    // Validación en tiempo real con Regex para nombre completo
    fullnameInput.addEventListener("input", () => {
        const fullnameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}(?:[- ][A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}){2,}$/;

        if (!fullnameRegex.test(fullnameInput.value.trim())) {
            fullnameInput.style.border = "2px solid red";
        } else {
            fullnameInput.style.border = "2px solid green";
            CookieAuth.set("site_user_fullname_" + username, fullnameInput.value);
        }
    });
    
    // Validación de formato telefónico español
    phoneInput.addEventListener("input", () => {
        const phoneRegex = /^(?:\+34\s?)?[6789]\d{8}$/;

        if (!phoneRegex.test(phoneInput.value.trim())) {
            phoneInput.style.border = "2px solid red";
        } else {
            phoneInput.style.border = "2px solid green";
            CookieAuth.set("site_user_phone_" + username, phoneInput.value);
        }
    });
    
    countrySelect.addEventListener("change", () => {
        CookieAuth.set("site_user_country_" + username, countrySelect.value);
    });

    // Bridge para activar el input file oculto desde un botón estilizado
    changeAvatarBtn.addEventListener("click", () => {
        avatarInput.click();
    });

    // Procesamiento de imagen en el cliente usando FileReader (Base64)
    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const newImageBase64 = event.target.result;
                picDisplay.src = newImageBase64;
                
                // Actualización atómica del usuario en la estructura JSON simulada
                try {
                    if (currentUser) {
                        currentUser.avatar = newImageBase64;
                        const userIndex = usersDB.findIndex(u => u.username === username);
                        if (userIndex !== -1) {
                            usersDB[userIndex] = currentUser;
                            CookieAuth.saveUsers(usersDB);
                        }
                    }
                    CookieAuth.set("site_user_avatar", newImageBase64);
                } catch (error) {
                    alert("La imagen es muy grande, intenta con una más pequeña.");
                }
            };
            
            reader.readAsDataURL(file);
        }
    });

    logoutBtn.addEventListener("click", () => {
        CookieAuth.delete("site_username");
        CookieAuth.delete("site_user_avatar");
        window.location.href = "index.html";
    });

    // Sistema simple de pestañas (Tabs) para navegación interna
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.dataset.tab;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            item.classList.add('active');
            const targetTab = document.getElementById(`tab-${tabName}`);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // Permite abrir una pestaña específica vía URL param
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
        const targetNav = document.querySelector(`[data-tab="${tabParam}"]`);
        if (targetNav) {
            targetNav.click();
        }
    }

    // Renderizado dinámico del historial de reservas desde JSON en cookies
    function cargarReservas() {
        const reservasContainer = document.getElementById('reservas-container');
        const reservas = JSON.parse(CookieAuth.get(`reservas_${username}`) || '[]');
        
        if (reservas.length === 0) {
            reservasContainer.innerHTML = '<p class="empty-state">No tienes reservas aún. <a href="destinos-destacados.html" style="color: #000; font-weight: 600;">Explora destinos</a></p>';
            return;
        }
        
        reservasContainer.innerHTML = '';
        
        reservas.reverse().forEach(reserva => {
            const card = document.createElement('div');
            card.className = 'reserva-card';
            
            // Inyección de HTML seguro ya que los datos vienen de inputs sanitizados o internos
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

        // Event listeners para botones generados dinámicamente
        document.querySelectorAll('.btn-cancel-reserva').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
                    const reservasActualizadas = reservas.filter(r => r.id !== id);
                    CookieAuth.set(`reservas_${username}`, JSON.stringify(reservasActualizadas));
                    cargarReservas();
                }
            });
        });
    }

    // Renderizado del historial de reseñas del usuario
    function cargarReseñas() {
        const reseñasContainer = document.getElementById('reseñas-container');
        const reseñas = JSON.parse(CookieAuth.get(`user_reviews_${username}`) || '[]');
        
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
                    </div>
                    <span class="reseña-stars">${stars}</span>
                </div>
                <p class="reseña-text">${review.text}</p>
                <p class="reseña-date">Escrita el ${review.fecha}</p>
                <button class="btn-delete-review" data-index="${index}">Eliminar reseña</button>
            `;
            
            reseñasContainer.appendChild(card);
        });

        document.querySelectorAll('.btn-delete-review').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
                    reseñas.splice(reseñas.length - 1 - index, 1);
                    CookieAuth.set(`user_reviews_${username}`, JSON.stringify(reseñas));
                    cargarReseñas();
                }
            });
        });
    }

    cargarReservas();
    cargarReseñas();
});
