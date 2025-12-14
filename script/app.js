// Sistema de autenticación centralizado en signup.html

// Servicio de autenticación y almacenamiento local
const AuthService = {
    getUsers: function() {
        const users = localStorage.getItem("usuarios");
        return users ? JSON.parse(users) : [];
    },
    saveUsers: function(users) {
        localStorage.setItem("usuarios", JSON.stringify(users));
    },
    checkSession: function() {
        return sessionStorage.getItem("login_valido") === "true";
    },
    getCurrentUser: function() {
        return sessionStorage.getItem("usuario_activo");
    },
    logout: function() {
        sessionStorage.setItem("login_valido", "false");
        sessionStorage.removeItem("usuario_activo");
        window.location.href = "signup.html";
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    const headerRight = document.querySelector('.header-right');
    const activeSessionUser = AuthService.getCurrentUser();
    const isSessionValid = AuthService.checkSession();
    
    // Recuperamos datos para mostrar el avatar si existe
    const usersDB = AuthService.getUsers();
    const currentUserData = usersDB.find(u => u.username === activeSessionUser);

    // Renderizado condicional del Header
    if (isSessionValid && activeSessionUser && headerRight) {
        
        const avatarSrc = (currentUserData && currentUserData.avatar) 
            ? currentUserData.avatar 
            : `https://ui-avatars.com/api/?name=${activeSessionUser}&background=0D8ABC&color=fff`;

        headerRight.innerHTML = `
            <a href="faq.html" class="nav-link" data-i18n="faq">FAQ</a>
            <a href="contacto.html" class="nav-link" data-i18n="help">Contacto</a>
            
            <div class="user-menu-item" style="display: flex; align-items: center; gap: 10px; margin-left: 10px;">
                <a href="mi-perfil.html" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
                    <img src="${avatarSrc}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd;">
                    <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${activeSessionUser}</span>
                </a>
                <button id="btn-logout-header" class="btn-text" style="color: #dc3545; font-size: 0.85rem; margin-left: 5px;" data-i18n="logout">Log Out</button>
            </div>
        `;

        document.getElementById('btn-logout-header').addEventListener('click', () => {
            AuthService.logout();
        });
    } else {
        initLoginRedirect();
    }

    function initLoginRedirect() {
        const loginBtn = document.getElementById('btn-login');
        const signupBtn = document.querySelector('a[href="signup.html"]');
        
        // Si estamos en signup.html, inicializar el sistema de login/registro
        if (window.location.pathname.includes('signup.html')) {
            initSignupPageAuth();
        } else {
            // En cualquier otra página, redirigir a signup.html
            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Guardar página de origen para volver después
                    sessionStorage.setItem("return_to", window.location.href);
                    window.location.href = "signup.html?mode=login";
                });
            }
            
            if (signupBtn) {
                signupBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    sessionStorage.setItem("return_to", window.location.href);
                    window.location.href = "signup.html?mode=register";
                });
            }
        }
    }

    // Sistema de autenticación para signup.html
    function initSignupPageAuth() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode') || 'register';
        
        // Mostrar formulario de login o registro según el parámetro
        const registerSection = document.querySelector('.auth-container');
        const loginModal = document.getElementById('login-modal');

        const headerLoginBtn = document.getElementById('btn-login');
        
        if (headerLoginBtn && loginModal) {
            headerLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loginModal.showModal();
            });
        }
        
        if (mode === 'login' && loginModal) {
            loginModal.showModal();
        }
        
        // Lógica del modal de Login (solo en signup.html)
        if (loginModal) {
            const closeModal = document.getElementById('close-modal');
            const loginForm = document.getElementById('login-form');

            // Autocompletado si existiera
            const savedUser = localStorage.getItem("remember_username");
            if (savedUser) {
                document.getElementById('username').value = savedUser;
                document.getElementById("remember-me").checked = true;
            }

            if (closeModal) {
                closeModal.addEventListener('click', () => {
                    loginModal.close();
                    // Limpiar parámetro de URL
                    window.history.replaceState({}, '', 'signup.html');
                });
            }

            // Lógica de Login
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // recuperar estructura de usuarios
                let usuarios = AuthService.getUsers();
                
                // recuperar datos de inicio sesión
                let loginL = document.getElementById('username').value.trim();
                let passwordL = document.getElementById('password').value;
                const remember = document.getElementById('remember-me').checked;

                let i = 0;
                let encontrado = false;
                
                // Algoritmo de búsqueda secuencial
                if (usuarios != null && usuarios.length > 0) {
                    while ((i < usuarios.length) && (!encontrado)) {
                        if ((usuarios[i].username == loginL) && (usuarios[i].password == passwordL)){
                            encontrado = true;    
                            break;            
                        }
                        i++;
                    }    
                }

                if (encontrado) {
                    sessionStorage.setItem("login_valido", "true");
                    sessionStorage.setItem("usuario_activo", loginL);
                    
                    if (remember) {
                        localStorage.setItem("remember_username", loginL);
                    } else {
                        localStorage.removeItem("remember_username");
                    }

                    // Volver a la página de origen
                    const returnTo = sessionStorage.getItem("return_to") || "index.html";
                    sessionStorage.removeItem("return_to");
                    window.location.href = returnTo;
                } else {
                    alert("Credenciales erróneas");
                    document.getElementById('username').value = "";
                    document.getElementById('password').value = "";
                }
            });
        }

        // Lógica del formulario de registro
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            const avatarInput = document.getElementById('reg-avatar');
            const avatarPreview = document.getElementById('avatar-preview');
            
            // Preview de imagen
            if (avatarInput) {
                avatarInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            avatarPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                            avatarPreview.classList.add('has-image');
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
            
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Recuperar valores
                const username = document.getElementById('reg-username').value.trim();
                const email = document.getElementById('reg-email').value.trim();
                const password = document.getElementById('reg-password').value;
                const confirmPassword = document.getElementById('reg-confirm').value;
                const fileInput = document.getElementById('reg-avatar');

                // Validaciones básicas de formato
                if (password !== confirmPassword) {
                    alert('Las contraseñas no coinciden');
                    return;
                }

                // recuperar estructura de usuarios
                let usuarios = AuthService.getUsers();
                
                // Verificar duplicados
                const userExists = usuarios.some(u => u.username === username);
                if (userExists) {
                    alert('El usuario ya existe.');
                    return;
                }

                const completarRegistro = (avatarData) => {
                    // crear objeto usuario
                    let usuario = {
                        username: username,
                        password: password,
                        email: email,
                        avatar: avatarData || null,
                        createdAt: new Date().toISOString()
                    };

                    // almacenar objeto
                    usuarios.push(usuario);
                    AuthService.saveUsers(usuarios);

                    // validar sesión y derivar
                    sessionStorage.setItem("login_valido", "true");
                    sessionStorage.setItem("usuario_activo", username);

                    alert('¡Registro completado!');
                    
                    // Volver a la página de origen o ir al inicio
                    const returnTo = sessionStorage.getItem("return_to") || "index.html";
                    sessionStorage.removeItem("return_to");
                    window.location.href = returnTo;
                };

                // Lectura de avatar si existe
                if (fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (evt) => completarRegistro(evt.target.result);
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    completarRegistro(null);
                }
            });
        }
    }

    loadHomeContent();
});

// Función para cargar contenido
function loadHomeContent() {
    const carousel = document.getElementById('home-carousel');
    let destinosGrid = document.querySelector('.destinos-grid'); 

    if (destinosGrid && destinosGrid.id === 'featured-grid') {
        destinosGrid = null;
    }
    
    if (!carousel && !destinosGrid) return;

    function createSlug(text) {
        return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
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
                    for (let i = 0; i < ciudad.name.length; i++) hash = ciudad.name.charCodeAt(i) + ((hash << 5) - hash);
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
                    <img src="${d.imagen}" alt="${d.nombre}" class="carousel-img">
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
                            <div class="rating" aria-label="Calificación ${d.rating} de 5 (${d.reviews} reseñas)">
                                <span class="rating-value">${d.rating}</span>
                                <span class="stars" aria-hidden="true">${starsStr}</span>
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
        console.error("Error cargando destinos:", error);
    }
}
