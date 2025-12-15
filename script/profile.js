document.addEventListener("DOMContentLoaded", () => {
    
    // Verificar sesión
    if (!SessionManager.isLoggedIn()) {
        window.location.href = "index.html";
        return;
    }
    
    const username = SessionManager.getCurrentUser();
    const userData = UserManager.getUserData(username);
    
    if (!userData) {
        alert('Error: No se encontraron datos del usuario');
        SessionManager.logout();
        return;
    }
    
    // Referencias a elementos
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
    
    // Mostrar nombre de usuario
    if (nameDisplay) nameDisplay.textContent = username;
    
    // Mostrar avatar
    const avatarSrc = userData.avatar || `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
    if (picDisplay) picDisplay.src = avatarSrc;
    
    // Mostrar email
    if (emailInput) emailInput.value = userData.email || '';
    if (emailDisplay) emailDisplay.textContent = userData.email || '';
    
    // Cargar datos del perfil
    if (fullnameInput) fullnameInput.value = userData.fullname || username;
    if (phoneInput) phoneInput.value = userData.phone || '';
    if (countrySelect) countrySelect.value = userData.country || '';
    
    // Guardar cambios automáticamente
    if (fullnameInput) {
        fullnameInput.addEventListener("input", () => {
            const fullnameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}(?:[- ][A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}){2,}$/;
            const value = fullnameInput.value.trim();
            
            if (value && !fullnameRegex.test(value)) {
                fullnameInput.style.border = "2px solid red";
            } else if (value) {
                fullnameInput.style.border = "2px solid green";
                UserManager.updateUser(username, { fullname: value });
            } else {
                fullnameInput.style.border = "";
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener("input", () => {
            const phoneRegex = /^(?:\+34\s?)?[6789]\d{8}$/;
            const value = phoneInput.value.trim();
            
            if (value && !phoneRegex.test(value)) {
                phoneInput.style.border = "2px solid red";
            } else if (value) {
                phoneInput.style.border = "2px solid green";
                UserManager.updateUser(username, { phone: value });
            } else {
                phoneInput.style.border = "";
                UserManager.updateUser(username, { phone: '' });
            }
        });
    }
    
    if (countrySelect) {
        countrySelect.addEventListener("change", () => {
            UserManager.updateUser(username, { country: countrySelect.value });
        });
    }
    
    // Cambiar avatar
    if (changeAvatarBtn && avatarInput) {
        changeAvatarBtn.addEventListener("click", () => {
            avatarInput.click();
        });
        
        avatarInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert("Por favor selecciona un archivo de imagen válido.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const MAX_SIZE = 60; 
                    
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    const lowResAvatar = canvas.toDataURL('image/jpeg', 0.6);

                    if (lowResAvatar.length > 3800) {
                        alert("La imagen sigue siendo demasiado compleja para guardarse en cookies. Intenta con una imagen más simple.");
                        return;
                    }

                    picDisplay.src = lowResAvatar;
                    const success = UserManager.updateUser(username, { avatar: lowResAvatar });
                    
                    if (success) {
                        alert("Foto de perfil actualizada correctamente (versión comprimida).");
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }    

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            SessionManager.logout();
        });
    }
    
    // Cargar reservas
    cargarReservas();
    
    // Cargar reseñas
    cargarReseñas();
});

// Cargar reservas del usuario
function cargarReservas() {
    const reservasContainer = document.getElementById('reservas-container');
    if (!reservasContainer) return;
    
    const username = SessionManager.getCurrentUser();
    const reservas = ReservasManager.getReservas(username);
    
    const countBadge = document.getElementById('reservas-count');
    if (countBadge) countBadge.textContent = reservas.length;
    
    if (reservas.length === 0) {
        reservasContainer.innerHTML = '<p class="empty-state">No tienes reservas aún. <a href="destinos-destacados.html" style="color: #000; font-weight: 600;">Explora destinos</a></p>';
        return;
    }
    
    reservasContainer.innerHTML = '';
    
    // Mostrar reservas (más recientes primero)
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
    
    // Eventos para cancelar
    document.querySelectorAll('.btn-cancel-reserva').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
                ReservasManager.deleteReserva(username, id);
                cargarReservas();
            }
        });
    });
}

// Cargar reseñas del usuario
function cargarReseñas() {
    const reseñasContainer = document.getElementById('reseñas-container');
    if (!reseñasContainer) return;
    
    const username = SessionManager.getCurrentUser();
    const reseñas = ReviewsManager.getUserReviews(username);
    
    const countBadge = document.getElementById('reseñas-count');
    if (countBadge) countBadge.textContent = reseñas.length;
    
    if (reseñas.length === 0) {
        reseñasContainer.innerHTML = '<p class="empty-state">No has escrito reseñas aún. <a href="destinos-destacados.html">Visita un destino</a></p>';
        return;
    }
    
    reseñasContainer.innerHTML = '';
    
    // Mostrar reseñas (más recientes primero)
    [...reseñas].reverse().forEach((review) => {
        const card = document.createElement('div');
        card.className = 'reseña-card';
        
        const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
        
        card.innerHTML = `
            <div class="reseña-header">
                <div>
                    <h4>${review.destinoNombre || 'Destino'}</h4>
                    <p class="reseña-location">${review.destinoPais || ''}</p>
                    <p class="reseña-date">${review.fecha || ''}</p>
                </div>
                <span class="reseña-stars">${stars}</span>
            </div>
            <p class="reseña-text">${review.text}</p>
            <button class="btn-delete-review" data-destino="${review.destino}" data-text="${review.text}">Eliminar reseña</button>
        `;
        
        reseñasContainer.appendChild(card);
    });
    
    // Eventos para eliminar
    document.querySelectorAll('.btn-delete-review').forEach(btn => {
        btn.addEventListener('click', () => {
            const destinoId = btn.dataset.destino;
            const reviewText = btn.dataset.text;
            
            if (confirm('¿Eliminar esta reseña?')) {
                ReviewsManager.deleteUserReview(username, destinoId, reviewText);
                cargarReseñas();
            }
        });
    });
}
