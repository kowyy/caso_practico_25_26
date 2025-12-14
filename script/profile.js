// Manejamos las reservas con cookies para que persistan aunque estemos en local
const CookieReservas = {
    set(name, value, days = 365) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    },
    
    get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    },
    
    getReservas(username) {
        const reservas = this.get(`reservas_${username}`);
        return reservas ? JSON.parse(reservas) : [];
    },
    
    saveReservas(username, reservas) {
        this.set(`reservas_${username}`, JSON.stringify(reservas));
    },
    
    addReserva(username, reserva) {
        const reservas = this.getReservas(username);
        reservas.push(reserva);
        this.saveReservas(username, reservas);
    },
    
    deleteReserva(username, reservaId) {
        const reservas = this.getReservas(username);
        const updated = reservas.filter(r => r.id !== reservaId);
        this.saveReservas(username, updated);
    }
};

// Lo mismo para las reseñas, así se ven reflejadas en el perfil
const CookieReseñas = {
    set(name, value, days = 365) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    },
    
    get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    },
    
    getUserReviews(username) {
        const reviews = this.get(`user_reviews_${username}`);
        return reviews ? JSON.parse(reviews) : [];
    },
    
    saveUserReviews(username, reviews) {
        this.set(`user_reviews_${username}`, JSON.stringify(reviews));
    },

    deleteUserReview(username, index) {
        const reviews = this.getUserReviews(username);
        reviews.splice(index, 1);
        this.saveUserReviews(username, reviews);
    }
};

// Gestión básica de la sesión y usuarios usando localStorage
const AuthService = {
    checkSession: function() {
        return sessionStorage.getItem("login_valido") === "true";
    },
    getCurrentUser: function() {
        return sessionStorage.getItem("usuario_activo");
    },
    logout: function() {
        sessionStorage.setItem("login_valido", "false");
        sessionStorage.removeItem("usuario_activo");
        window.location.href = "index.html";
    },
    getData: function(key) {
        return localStorage.getItem(key);
    },
    saveData: function(key, value) {
        localStorage.setItem(key, value);
    },
    getUsers: function() {
        const users = localStorage.getItem("usuarios");
        return users ? JSON.parse(users) : [];
    },
    saveUsers: function(users) {
        localStorage.setItem("usuarios", JSON.stringify(users));
    }
};

document.addEventListener("DOMContentLoaded", () => {
    
    // Si no hay sesión, mandamos al usuario fuera
    if (!AuthService.checkSession()) {
        window.location.href = "index.html";
        return;
    }

    const username = AuthService.getCurrentUser();
    const usersDB = AuthService.getUsers();
    const currentUser = usersDB.find(u => u.username === username);

    // Referencias a los elementos de la interfaz
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
    
    // Ponemos el avatar del usuario o uno generado por defecto
    let avatarSrc;
    if (currentUser && currentUser.avatar) {
        avatarSrc = currentUser.avatar;
    } else {
        avatarSrc = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
    }
    picDisplay.src = avatarSrc;

    let userEmail = "";
    if (currentUser && currentUser.email) {
        userEmail = currentUser.email;
    } else {
        userEmail = `${username.toLowerCase().replace(/\s/g, '')}@example.com`;
    }
    
    emailInput.value = userEmail;
    emailDisplay.textContent = userEmail;

    // Rellenamos los campos con lo que tengamos guardado
    const savedFullname = AuthService.getData("user_fullname_" + username);
    const savedPhone = AuthService.getData("user_phone_" + username);
    const savedCountry = AuthService.getData("user_country_" + username);

    if (savedFullname) fullnameInput.value = savedFullname;
    if (savedPhone) phoneInput.value = savedPhone;
    if (savedCountry) countrySelect.value = savedCountry;

    // Guardamos automáticamente cualquier cambio en los inputs
    fullnameInput.addEventListener("input", () => {
        AuthService.saveData("user_fullname_" + username, fullnameInput.value);
    });
    
    phoneInput.addEventListener("input", () => {
        AuthService.saveData("user_phone_" + username, phoneInput.value);
    });
    
    countrySelect.addEventListener("change", () => {
        AuthService.saveData("user_country_" + username, countrySelect.value);
    });

    // Lógica para subir una nueva foto de perfil
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
                    // Actualizamos el usuario en la "base de datos" local
                    if (currentUser) {
                        currentUser.avatar = newImageBase64;
                        const userIndex = usersDB.findIndex(u => u.username === username);
                        if (userIndex !== -1) {
                            usersDB[userIndex] = currentUser;
                            AuthService.saveUsers(usersDB);
                        }
                    }
                } catch (error) {
                    alert("La imagen es muy grande, intenta con una más pequeña.");
                }
            };
            
            reader.readAsDataURL(file);
        }
    });

    logoutBtn.addEventListener("click", () => {
        AuthService.logout();
    });

    // Control de pestañas si las hubiera
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

    // Renderizamos las reservas guardadas en cookies
    function cargarReservas() {
        const reservasContainer = document.getElementById('reservas-container');
        const username = AuthService.getCurrentUser();
        
        console.log("Cargando reservas para:", username);
        const reservas = CookieReservas.getReservas(username);
        console.log("Reservas encontradas:", reservas);
        
        const countBadge = document.getElementById('reservas-count');
        if (countBadge) countBadge.textContent = reservas.length;
        
        if (reservas.length === 0) {
            reservasContainer.innerHTML = '<p class="empty-state">No tienes reservas aún. <a href="destinos-destacados.html" style="color: #000; font-weight: 600;">Explora destinos</a></p>';
            return;
        }
        
        reservasContainer.innerHTML = '';
        
        // Creamos las tarjetas de reserva, las más nuevas primero
        [...reservas].reverse().forEach(reserva => {
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
                    <p><strong>Acompañantes:</strong> ${reserva.acompañantes.length}</p>
                    <p class="reserva-precio">${reserva.precio}</p>
                    <button class="btn-cancel-reserva" data-id="${reserva.id}">Cancelar reserva</button>
                </div>
            `;
            
            reservasContainer.appendChild(card);
        });

        // Eventos para cancelar reservas
        document.querySelectorAll('.btn-cancel-reserva').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
                    CookieReservas.deleteReserva(username, id);
                    cargarReservas();
                }
            });
        });
    }

    // Renderizamos las reseñas del usuario guardadas en cookies
    function cargarReseñas() {
        const reseñasContainer = document.getElementById('reseñas-container');
        const username = AuthService.getCurrentUser();
        
        const reseñas = CookieReseñas.getUserReviews(username);
        
        const countBadge = document.getElementById('reseñas-count');
        if (countBadge) countBadge.textContent = reseñas.length;
        
        if (reseñas.length === 0) {
            reseñasContainer.innerHTML = '<p class="empty-state">No has escrito reseñas aún. <a href="destinos-destacados.html">Visita un destino</a></p>';
            return;
        }
        
        reseñasContainer.innerHTML = '';
        
        // Mostramos las reseñas
        [...reseñas].reverse().forEach((review, originalIndex) => {
            const realIndex = reseñas.length - 1 - originalIndex;
            
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
                <button class="btn-delete-review" data-index="${realIndex}">Eliminar reseña</button>
            `;
            
            reseñasContainer.appendChild(card);
        });

        // Eventos para eliminar reseñas
        document.querySelectorAll('.btn-delete-review').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (confirm('¿Eliminar reseña?')) {
                    CookieReseñas.deleteUserReview(username, index);
                    cargarReseñas();
                }
            });
        });
    }

    cargarReservas();
    cargarReseñas();
});
