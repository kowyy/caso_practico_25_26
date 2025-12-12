document.addEventListener('DOMContentLoaded', () => {
    
    // Controlamos qué mostrar en el header si el usuario tiene sesión activa o no
    const headerRight = document.querySelector('.header-right');
    const activeSessionUser = localStorage.getItem('site_username') || sessionStorage.getItem('site_username');
    
    // Recuperamos los datos de este usuario específico desde nuestra base de datos simulada
    const usersDB = JSON.parse(localStorage.getItem('database_users') || '[]');
    const currentUserData = usersDB.find(u => u.username === activeSessionUser);

    if (activeSessionUser && headerRight) {
        
        // Si el usuario tiene avatar guardado usamos ese y si no generamos uno por defecto
        const avatarSrc = (currentUserData && currentUserData.avatar) 
            ? currentUserData.avatar 
            : `https://ui-avatars.com/api/?name=${activeSessionUser}&background=0D8ABC&color=fff`;

        // Inyectamos el HTML del usuario logueado en la cabecera
        headerRight.innerHTML = `
            <a href="#" class="nav-link" data-i18n="faq">FAQ</a>
            <a href="#" class="nav-link" data-i18n="help">Ayuda</a>
            
            <div class="user-menu-item" style="display: flex; align-items: center; gap: 10px; margin-left: 10px;">
                <a href="mi-perfil.html" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
                    <img src="${avatarSrc}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd;">
                    <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${activeSessionUser}</span>
                </a>
                <button id="btn-logout-header" class="btn-text" style="color: #dc3545; font-size: 0.85rem; margin-left: 5px;" data-i18n="logout">Log Out</button>
            </div>
        `;

        // Asignamos el evento para destruir la sesión local y de sesión
        document.getElementById('btn-logout-header').addEventListener('click', () => {
            localStorage.removeItem('site_username');
            sessionStorage.removeItem('site_username');
            window.location.reload(); 
        });
    } else {
        // Si no hay usuario activo inicializamos la lógica del modal de login
        initLoginModal();
    }

    // Función que gestiona la apertura y el envío del formulario de login
    function initLoginModal() {
        const loginBtn = document.getElementById('btn-login');
        const modal = document.getElementById('login-modal');
        
        // Verificamos que los elementos existan en el DOM antes de asignar eventos
        if (loginBtn && modal) {
            const closeModal = document.getElementById('close-modal');
            const loginForm = document.getElementById('login-form');

            // Autorellenar si hay credenciales recordadas
            const savedUser = localStorage.getItem("remember_username");
            const savedPass = localStorage.getItem("remember_password");

            if (savedUser) {
                document.getElementById('username').value = savedUser;
                document.getElementById("remember-me").checked = true; // Icono de las credenciales marcado
            }
            if (savedPass) {
                document.getElementById('password').value = savedPass;
            }

            // Abrimos el modal nativo del navegador
            loginBtn.addEventListener('click', () => modal.showModal());
            
            if (closeModal) {
                closeModal.addEventListener('click', () => modal.close());
            }

            // Aquí procesamos el intento de inicio de sesión
            loginForm.addEventListener('submit', (e) => {
                // Evitamos que el formulario recargue la página por defecto para manejarlo nosotros
                const usernameInput = document.getElementById('username').value;
                const passwordInput = document.getElementById('password').value;
                const remember = document.getElementById('remember-me').checked;

                // Leemos nuestra base de datos de usuarios registrados del almacenamiento local
                const currentUsers = JSON.parse(localStorage.getItem('database_users') || '[]');

                // Buscamos si existe un usuario que coincida exactamente en nombre y contraseña
                const validUser = currentUsers.find(user => user.username === usernameInput && user.password === passwordInput);

                if (validUser) {
                    // Si las credenciales son correctas guardamos la sesión
                    if (remember) {
                        localStorage.setItem('site_username', validUser.username);
                        localStorage.setItem("remember_username", usernameInput);
                        localStorage.setItem("remember_password", passwordInput);
                    } else {
                        sessionStorage.setItem('site_username', validUser.username);
                    }
                    window.location.reload();
                } else {
                    // Si no encontramos al usuario detenemos el evento y mostramos error
                    e.preventDefault();
                    alert('Usuario o contraseña incorrectos. Por favor regístrate si no tienes cuenta.');
                    modal.close(); // Cerramos el modal para que pueda intentarlo de nuevo o ir a registro
                }
            });
        }
    }

    // Intentamos inicializar el modal por si acaso estamos en una página que lo carga dinámicamente
    initLoginModal();

    // Lógica para el formulario de registro en signup.html
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const avatarInput = document.getElementById('reg-avatar');
        const avatarPreview = document.getElementById('avatar-preview');
        const avatarFeedback = document.getElementById('avatar-feedback');
        
        // Vista previa de la imagen cuando el usuario selecciona un archivo
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                
                if (file) {
                    // Validamos que el archivo no sea excesivamente pesado para localStorage
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
        
        // Manejamos el envío del formulario de registro
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm').value;
            const fileInput = document.getElementById('reg-avatar');

            // Validación para un email real mediante una expresión regular
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

            if (!emailRegex.test(email)) {
                alert("Por favor introduce un correo electrónico válido.");
                return;
            }

            // Validación de una contraseña segura mediante una expresión regular
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

            // Validaciones básicas antes de procesar
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            // Recuperamos los usuarios existentes para evitar duplicados
            const currentUsers = JSON.parse(localStorage.getItem('database_users') || '[]');
            
            // Comprobamos si el nombre de usuario ya está cogido
            const userExists = currentUsers.some(u => u.username === username);
            if (userExists) {
                alert('El nombre de usuario ya existe. Por favor elige otro.');
                return;
            }

            // Función auxiliar para guardar el usuario y redirigir
            const saveAndRedirect = (avatarData) => {
                const newUser = {
                    username: username,
                    email: email,
                    password: password, // En un entorno real esto debería ir hasheado
                    avatar: avatarData || null,
                    createdAt: new Date().toISOString()
                };

                // Añadimos el nuevo usuario al array y guardamos en localStorage
                currentUsers.push(newUser);
                localStorage.setItem('database_users', JSON.stringify(currentUsers));
                localStorage.setItem('site_username', username);
                localStorage.setItem('site_user_avatar', avatarData);
                if (avatarData) {
                    localStorage.setItem('site_user_avatar', avatarData);
                }

                alert('¡Registro completado! Bienvenido.');
                window.location.href = 'index.html';
            };

            // Procesamos la imagen si existe antes de guardar
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

async function loadHomeContent() {
    const carousel = document.getElementById('home-carousel');
    let destinosGrid = document.querySelector('.destinos-grid'); 

    if (destinosGrid && destinosGrid.id === 'featured-grid') {
        destinosGrid = null;
    }
    
    // 3. El resto sigue igual...
    if (!carousel && !destinosGrid) return;

    function createSlug(text) {
        return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    }

    function getStars(value) {
        const rating = Math.round(value);
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }

    try {
        const response = await fetch('ciudades-del-mundo.json');
        if (!response.ok) throw new Error('Error al cargar ciudades-del-mundo.json');
        
        const data = await response.json();
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
        if (carousel) carousel.innerHTML = "<p style='padding: 2rem; text-align: center;'>Error al cargar destinos</p>";
        if (destinosGrid) destinosGrid.innerHTML = "<p style='padding: 2rem; text-align: center;'>Error al cargar destinos</p>";
    }
}
