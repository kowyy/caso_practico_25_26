// Utilidad de cookies replicada (debería refactorizarse a un módulo común)
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
    
    getUsers() {
        const data = this.get('database_users');
        return data ? JSON.parse(data) : [];
    },
    
    saveUsers(users) {
        this.set('database_users', JSON.stringify(users));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    const headerRight = document.querySelector('.header-right');
    const activeSessionUser = CookieAuth.get('site_username');
    
    const usersDB = CookieAuth.getUsers();
    const currentUserData = usersDB.find(u => u.username === activeSessionUser);

    // Renderizado condicional del Header: Muestra perfil si hay sesión, o login si no
    if (activeSessionUser && headerRight) {
        
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
            CookieAuth.delete('site_username');
            window.location.reload(); 
        });
    } else {
        initLoginModal();
    }

    // Inicialización del modal nativo de Login usando <dialog> o overlay custom
    function initLoginModal() {
        const loginBtn = document.getElementById('btn-login');
        const modal = document.getElementById('login-modal');
        
        if (loginBtn && modal) {
            const closeModal = document.getElementById('close-modal');
            const loginForm = document.getElementById('login-form');

            // Autocompletado desde cookies "remember me"
            const savedUser = CookieAuth.get("remember_username");
            const savedPass = CookieAuth.get("remember_password");

            if (savedUser) {
                document.getElementById('username').value = savedUser;
                document.getElementById("remember-me").checked = true;
            }
            if (savedPass) {
                document.getElementById('password').value = savedPass;
            }

            loginBtn.addEventListener('click', () => modal.showModal());
            
            if (closeModal) {
                closeModal.addEventListener('click', () => modal.close());
            }

            loginForm.addEventListener('submit', (e) => {
                const usernameInput = document.getElementById('username').value;
                const passwordInput = document.getElementById('password').value;
                const remember = document.getElementById('remember-me').checked;

                const currentUsers = CookieAuth.getUsers();

                // Validación simple contra array de usuarios en memoria
                const validUser = currentUsers.find(user => user.username === usernameInput && user.password === passwordInput);

                if (validUser) {
                    if (remember) {
                        CookieAuth.set('site_username', validUser.username, 365);
                        CookieAuth.set("remember_username", usernameInput, 365);
                        CookieAuth.set("remember_password", passwordInput, 365);
                    } else {
                        CookieAuth.set('site_username', validUser.username, 1);
                    }
                    window.location.reload();
                } else {
                    e.preventDefault();
                    alert('Usuario o contraseña incorrectos. Por favor regístrate si no tienes cuenta.');
                    modal.close();
                }
            });
        }
    }

    initLoginModal();

    // Lógica del formulario de registro, incluyendo validaciones y preview de imagen
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const avatarInput = document.getElementById('reg-avatar');
        const avatarPreview = document.getElementById('avatar-preview');
        const avatarFeedback = document.getElementById('avatar-feedback');
        
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                
                // Validación de tamaño del lado del cliente antes de procesar
                if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                        avatarFeedback.textContent = 'La imagen es muy grande (máx 2MB)';
                        avatarFeedback.classList.remove('success');
                        avatarFeedback.style.color = '#dc3545';
                        avatarPreview.classList.remove('has-image');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        avatarPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                        avatarPreview.classList.add('has-image');
                        avatarFeedback.textContent = '✓ Foto seleccionada correctamente';
                        avatarFeedback.classList.add('success');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm').value;
            const fileInput = document.getElementById('reg-avatar');

            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

            if (!emailRegex.test(email)) {
                alert("Por favor introduce un correo electrónico válido.");
                return;
            }

            // Política de contraseñas fuertes forzada mediante Regex
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

            const currentUsers = CookieAuth.getUsers();
            
            const userExists = currentUsers.some(u => u.username === username);
            if (userExists) {
                alert('El nombre de usuario ya existe. Por favor elige otro.');
                return;
            }

            // Función auxiliar para finalizar el registro y guardar en cookies
            const saveAndRedirect = (avatarData) => {
                const newUser = {
                    username: username,
                    email: email,
                    password: password,
                    avatar: avatarData || null,
                    createdAt: new Date().toISOString()
                };

                currentUsers.push(newUser);
                CookieAuth.saveUsers(currentUsers);
                CookieAuth.set('site_username', username);
                if (avatarData) {
                    CookieAuth.set('site_user_avatar', avatarData);
                }

                alert('¡Registro completado! Bienvenido.');
                window.location.href = 'index.html';
            };

            // Manejo asíncrono de la lectura del archivo antes de guardar
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    try {
                        saveAndRedirect(evt.target.result);
                    } catch (error) {
                        alert("La imagen es demasiado grande para guardarla. Se guardará el usuario sin foto.");
                        saveAndRedirect(null);
                    }
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                saveAndRedirect(null);
            }
        });
    }

    loadHomeContent();
});

// Generador de contenido dinámico para el carrusel y el grid de destinos
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
        const data = CIUDADES_DATA; // Se asume que esta constante global existe
        let allDestinos = [];
        
        // Aplanamiento de la estructura jerárquica (Continente -> País -> Ciudad)
        data.continents.forEach(cont => {
            cont.countries.forEach(pais => {
                pais.cities.forEach(ciudad => {
                    // Generación determinista de precio/rating basado en hash del nombre
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

        // Aleatorización para dar variedad a la UI
        allDestinos.sort(() => Math.random() - 0.5);

        // Renderizado del Carrusel
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

        // Renderizado del Grid
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
        if (carousel) carousel.innerHTML = "<p style='padding: 2rem; text-align: center;'>Error al cargar destinos</p>";
        if (destinosGrid) destinosGrid.innerHTML = "<p style='padding: 2rem; text-align: center;'>Error al cargar destinos</p>";
    }
}
