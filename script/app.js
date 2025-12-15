// Utilidad general de cookies
const CookieAuth = {
    set(name, value, days = 365) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        
        const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
        
        // Validar tamaño máximo para cookies
        if (new Blob([cookieString]).size > 4000) {
            return false;
        }

        document.cookie = cookieString;
        
        if (!this.get(name) && value) {
             return false;
        }
        
        return true;
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
    
    delete(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
};

// Gestión de usuarios con cookies
const UserManager = {
    // Obtener todos los usuarios
    getUsers() {
        const users = CookieAuth.get('database_users');
        return users ? JSON.parse(users) : [];
    },
    
    // Guardar todos los usuarios
    saveUsers(users) {
        return CookieAuth.set('database_users', JSON.stringify(users));
    },
    
    // Obtener datos de un usuario específico
    getUserData(username) {
        const users = this.getUsers();
        return users.find(u => u.username === username) || null;
    },
    
    // Actualizar datos de un usuario
    updateUser(username, updates) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            return this.saveUsers(users);
        }
        return false;
    },
    
    // Crear nuevo usuario
    createUser(userData) {
        const users = this.getUsers();
        users.push({
            username: userData.username,
            password: userData.password,
            email: userData.email,
            fullname: userData.fullname || userData.username,
            phone: userData.phone || '',
            country: userData.country || '',
            avatar: userData.avatar || null,
            createdAt: new Date().toISOString()
        });
        return this.saveUsers(users);
    },
    
    // Verificar si existe un usuario
    userExists(username) {
        const users = this.getUsers();
        return users.some(u => u.username === username);
    },
    
    // Validar credenciales
    validateCredentials(username, password) {
        const users = this.getUsers();
        return users.find(u => u.username === username && u.password === password);
    }
};

// Gestión de sesión con cookies
const SessionManager = {
    // Iniciar sesión
    login(username, remember = false) {
        CookieAuth.set('site_session', 'active', remember ? 365 : 1);
        CookieAuth.set('site_username', username, remember ? 365 : 1);
        if (remember) {
            CookieAuth.set('site_remember', username, 365);
        }
    },
    
    // Cerrar sesión
    logout() {
        CookieAuth.delete('site_session');
        CookieAuth.delete('site_username');
        window.location.href = "index.html";
    },
    
    // Verificar si hay sesión activa
    isLoggedIn() {
        return CookieAuth.get('site_session') === 'active' && CookieAuth.get('site_username') !== null;
    },
    
    // Obtener usuario actual
    getCurrentUser() {
        return CookieAuth.get('site_username');
    },
    
    // Obtener usuario recordado
    getRememberedUser() {
        return CookieAuth.get('site_remember');
    }
};

// Gestión de reservas con cookies
const ReservasManager = {
    // Obtener reservas de un usuario
    getReservas(username) {
        const reservas = CookieAuth.get(`reservas_${username}`);
        return reservas ? JSON.parse(reservas) : [];
    },
    
    // Guardar reservas de un usuario
    saveReservas(username, reservas) {
        CookieAuth.set(`reservas_${username}`, JSON.stringify(reservas));
    },
    
    // Añadir reserva
    addReserva(username, reserva) {
        const reservas = this.getReservas(username);
        reservas.push({
            id: Date.now(),
            ...reserva,
            fecha: new Date().toLocaleDateString('es-ES'),
            estado: 'Confirmada'
        });
        this.saveReservas(username, reservas);
    },
    
    // Eliminar reserva
    deleteReserva(username, reservaId) {
        const reservas = this.getReservas(username);
        const updated = reservas.filter(r => r.id !== reservaId);
        this.saveReservas(username, updated);
    }
};

// Gestión de reseñas con cookies
const ReviewsManager = {
    // Obtener reseñas de un destino
    getDestinationReviews(destinoId) {
        const reviews = CookieAuth.get(`reviews_${destinoId}`);
        return reviews ? JSON.parse(reviews) : null;
    },
    
    // Guardar reseñas de un destino
    saveDestinationReviews(destinoId, reviews) {
        CookieAuth.set(`reviews_${destinoId}`, JSON.stringify(reviews));
    },
    
    // Añadir reseña
    addReview(destinoId, review) {
        let reviews = this.getDestinationReviews(destinoId);
        
        // Si no hay reseñas, inicializar array vacío
        if (!reviews) {
            reviews = [];
        }
        
        reviews.push(review);
        this.saveDestinationReviews(destinoId, reviews);
    },
    
    // Obtener todas las reseñas de un usuario
    getUserReviews(username) {
        const allReviews = [];
        const cookieStr = document.cookie;
        const cookies = cookieStr.split(';');
        
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name.startsWith('reviews_')) {
                try {
                    const reviews = JSON.parse(decodeURIComponent(value));
                    const userReviews = reviews.filter(r => r.name === username);
                    allReviews.push(...userReviews);
                } catch (e) {
                    // Cookie corrupta, ignorar
                }
            }
        });
        
        return allReviews;
    },
    
    // Eliminar reseña de un usuario
    deleteUserReview(username, destinoId, reviewText) {
        const reviews = this.getDestinationReviews(destinoId);
        if (reviews) {
            const filtered = reviews.filter(r => !(r.name === username && r.text === reviewText));
            this.saveDestinationReviews(destinoId, filtered);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // Actualizar cabecera según estado de sesión
    updateHeader();
    
    // Si estamos en signup.html, inicializar autenticación
    if (window.location.pathname.includes('signup.html')) {
        initAuthPage();
    } else {
        // En otras páginas, configurar botones de login/signup
        setupAuthButtons();
    }
    
    // Cargar contenido de home si es necesario
    loadHomeContent();
});

// Actualizar cabecera según estado de sesión
function updateHeader() {
    const headerRight = document.querySelector('.header-right');
    if (!headerRight) return;
    
    if (SessionManager.isLoggedIn()) {
        const username = SessionManager.getCurrentUser();
        const userData = UserManager.getUserData(username);
        
        const avatarSrc = userData && userData.avatar 
            ? userData.avatar 
            : `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;

        headerRight.innerHTML = `
            <a href="faq.html" class="nav-link" data-i18n="faq">FAQ</a>
            <a href="contacto.html" class="nav-link" data-i18n="help">Contacto</a>
            
            <div class="user-menu-item" style="display: flex; align-items: center; gap: 10px; margin-left: 10px;">
                <a href="mi-perfil.html" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
                    <img src="${avatarSrc}" alt="Avatar de ${username}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd;">
                    <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${username}</span>
                </a>
                <button id="btn-logout-header" class="btn-text" style="color: #a71d2a; font-size: 0.85rem; margin-left: 5px;" data-i18n="logout">Log Out</button>
            </div>
        `;
        
        document.getElementById('btn-logout-header').addEventListener('click', () => {
            SessionManager.logout();
        });
    }
}

// Configurar botones de autenticación
function setupAuthButtons() {
    const loginBtn = document.getElementById('btn-login');
    const signupBtn = document.querySelector('a[href="signup.html"]');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            CookieAuth.set('return_url', window.location.href, 1);
            window.location.href = "signup.html?mode=login";
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            CookieAuth.set('return_url', window.location.href, 1);
            window.location.href = "signup.html?mode=register";
        });
    }
}

// Inicializar página de autenticación
function initAuthPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || 'register';
    
    const loginModal = document.getElementById('login-modal');
    const headerLoginBtn = document.getElementById('btn-login');
    
    // Botón del header para abrir modal
    if (headerLoginBtn && loginModal) {
        headerLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.showModal();
        });
    }
    
    // Si llegamos con mode=login, abrir modal
    if (mode === 'login' && loginModal) {
        loginModal.showModal();
    }
    
    // Configurar modal de login
    if (loginModal) {
        setupLoginModal(loginModal);
    }
    
    // Configurar formulario de registro
    setupSignupForm();
}

// Configurar modal de login
function setupLoginModal(loginModal) {
    const closeBtn = document.getElementById('close-modal');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember-me');
    
    // Autocompletar si hay usuario recordado
    const rememberedUser = SessionManager.getRememberedUser();
    if (rememberedUser && usernameInput) {
        usernameInput.value = rememberedUser;
        rememberCheckbox.checked = true;
    }
    
    // Cerrar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            loginModal.close();
            window.history.replaceState({}, '', 'signup.html');
        });
    }
    
    // Procesar login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const remember = rememberCheckbox.checked;
            
            const user = UserManager.validateCredentials(username, password);
            
            if (user) {
                SessionManager.login(username, remember);
                
                const returnUrl = CookieAuth.get('return_url') || 'index.html';
                CookieAuth.delete('return_url');
                window.location.href = returnUrl;
            } else {
                alert('Credenciales incorrectas');
                passwordInput.value = '';
            }
        });
    }
}

// Configurar formulario de registro
function setupSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;
    
    const avatarInput = document.getElementById('reg-avatar');
    const avatarPreview = document.getElementById('avatar-preview');
    
    // Preview de avatar
    if (avatarInput && avatarPreview) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    avatarPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                    avatarPreview.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Procesar registro
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;
        
        // Validar email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("Por favor introduce un correo electrónico válido.");
            return;
        }
        
        // Validar contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\-_])[A-Za-z\d!@#\$%\^&\*\-_]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert(
                "La contraseña debe incluir:\n" +
                "• Mínimo 8 caracteres\n" +
                "• Al menos 1 letra mayúscula\n" +
                "• Al menos 1 letra minúscula\n" +
                "• Al menos 1 número\n" +
                "• Al menos 1 símbolo (!@#$%^&*-_)\n"
            );
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        if (UserManager.userExists(username)) {
            alert('El usuario ya existe');
            return;
        }
        
        // Función para completar registro
        const completeRegistration = (avatarData) => {
            const success = UserManager.createUser({
                username: username,
                password: password,
                email: email,
                fullname: username,
                avatar: avatarData
            });
            
            if (success) {
                SessionManager.login(username, false);
                alert('¡Registro completado!');
                const returnUrl = CookieAuth.get('return_url') || 'index.html';
                CookieAuth.delete('return_url');
                window.location.href = returnUrl;
            } else {
                alert("No se pudo completar el registro. Verifica el tamaño de los datos.");
            }
        };
        
        // Procesar avatar si existe
        if (avatarInput.files && avatarInput.files[0]) {
            const file = avatarInput.files[0];
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
                        if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                    } else {
                        if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const compressedAvatar = canvas.toDataURL('image/jpeg', 0.5);
                    
                    if (compressedAvatar.length > 3500) {
                        alert("La imagen es demasiado grande. Se registrará sin imagen.");
                        completeRegistration(null);
                    } else {
                        completeRegistration(compressedAvatar);
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            completeRegistration(null);
        }
    });
}

// Cargar contenido de home
function loadHomeContent() {
    const carousel = document.getElementById('home-carousel');
    let destinosGrid = document.querySelector('.destinos-grid');
    
    if (destinosGrid && destinosGrid.id === 'featured-grid') {
        destinosGrid = null;
    }
    
    if (!carousel && !destinosGrid) return;
    
    function createSlug(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
    
    function getStars(value) {
        const rating = Math.round(value);
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }
    
    try {
        const data = CIUDADES_DATA;
        let allDestinos = [];
        
        data.continents.forEach(cont => {
            cont.countries.forEach(pais => {
                pais.cities.forEach(ciudad => {
                    let hash = 0;
                    for (let i = 0; i < ciudad.name.length; i++) {
                        hash = ciudad.name.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    const precio = 500 + (Math.abs(hash) % 1500);
                    const rating = (3 + (Math.abs(hash) % 21) / 10).toFixed(1);
                    const reviews = 50 + (Math.abs(hash) % 450);
                    
                    allDestinos.push({
                        id: createSlug(ciudad.name),
                        nombre: ciudad.name,
                        pais: pais.name,
                        descripcion: ciudad.description,
                        imagen: ciudad.image.url,
                        precio: precio,
                        rating: rating,
                        reviews: reviews,
                        url: `destino-template.html?id=${createSlug(ciudad.name)}`
                    });
                });
            });
        });
        
        allDestinos.sort(() => Math.random() - 0.5);
        
        if (carousel) {
            const carouselDestinos = allDestinos.slice(0, 10);
            carousel.innerHTML = '';
            
            carouselDestinos.forEach(d => {
                const card = document.createElement('div');
                card.className = 'carousel-destination-card';
                card.onclick = () => location.href = d.url;
                
                card.innerHTML = `
                    <img src="${d.imagen}" alt="${d.nombre}" class="carousel-img" loading="lazy">
                    <div class="carousel-info">
                        <h3>${d.nombre}</h3>
                        <p class="carousel-location">${d.pais}</p>
                        <div class="carousel-rating">
                            <span class="stars">${getStars(d.rating)}</span>
                            <span class="rating-value">${d.rating}</span>
                            <span class="reviews">(${d.reviews} reseñas)</span>
                        </div>
                    </div>
                `;
                carousel.appendChild(card);
            });
            
            const prevBtn = document.querySelector('.carousel-nav.prev');
            const nextBtn = document.querySelector('.carousel-nav.next');
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -350, behavior: 'smooth' }));
                nextBtn.addEventListener('click', () => carousel.scrollBy({ left: 350, behavior: 'smooth' }));
            }
        }
        
        if (destinosGrid) {
            const gridDestinos = allDestinos.slice(10, 16);
            destinosGrid.innerHTML = "";
            
            gridDestinos.forEach(d => {
                const starsStr = getStars(d.rating);
                const article = document.createElement("article");
                article.className = "destino-card";
                
                article.innerHTML = `
                    <div class="thumb">
                        <img src="${d.imagen}" alt="${d.nombre}" loading="lazy">
                    </div>
                    <div class="card-body">
                        <h3 class="destino-title">${d.nombre}</h3>
                        <div class="meta-row">
                            <button class="ver-mas" onclick="location.href='${d.url}'">Ver más</button>
                            <div class="rating">
                                <span class="rating-value">${d.rating}</span>
                                <span class="stars">${starsStr}</span>
                                <span class="reviews">(${d.reviews} reseñas)</span>
                            </div>
                        </div>
                    </div>
                `;
                destinosGrid.appendChild(article);
            });
        }
        
        if (window.updateDynamicTranslations) {
            window.updateDynamicTranslations();
        }
        
    } catch (error) {
    }
}

// Exportar para uso global
window.CookieAuth = CookieAuth;
window.UserManager = UserManager;
window.SessionManager = SessionManager;
window.ReservasManager = ReservasManager;
window.ReviewsManager = ReviewsManager;
