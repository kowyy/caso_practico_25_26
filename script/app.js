document.addEventListener('DOMContentLoaded', () => {
    
    // Controlamos qué mostrar en el header (Login o Perfil)
    const headerRight = document.querySelector('.header-right');
    const savedUser = localStorage.getItem('site_username') || sessionStorage.getItem('site_username');
    const savedAvatar = localStorage.getItem('site_user_avatar');

    if (savedUser && headerRight) {
        
        // Usamos la foto guardada o generamos las iniciales
        const avatarSrc = savedAvatar || `https://ui-avatars.com/api/?name=${savedUser}&background=0D8ABC&color=fff`;

        // Inyectamos el HTML del usuario logueado
        headerRight.innerHTML = `
            <a href="#" class="nav-link" data-i18n="faq">FAQ</a>
            <a href="#" class="nav-link" data-i18n="help">Ayuda</a>
            
            <div class="user-menu-item" style="display: flex; align-items: center; gap: 10px; margin-left: 10px;">
                <a href="mi-perfil.html" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
                    <img src="${avatarSrc}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd;">
                    <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${savedUser}</span>
                </a>
                <button id="btn-logout-header" class="btn-text" style="color: #dc3545; font-size: 0.85rem; margin-left: 5px;">Log Out</button>
            </div>
        `;

        // Funcionalidad del botón Log Out del header
        document.getElementById('btn-logout-header').addEventListener('click', () => {
            localStorage.removeItem('site_username');
            localStorage.removeItem('site_user_avatar');
            sessionStorage.removeItem('site_username');
            window.location.reload(); 
        });
    } else {
        // Si no hay usuario, iniciamos el sistema de modal normal
        initLoginModal();
    }


    // Función para manejar el modal de login
    function initLoginModal() {
        const loginBtn = document.getElementById('btn-login');
        const modal = document.getElementById('login-modal');
        
        if (loginBtn && modal) {
            const closeModal = document.getElementById('close-modal');
            const loginForm = document.getElementById('login-form');

            loginBtn.addEventListener('click', () => modal.showModal());
            closeModal.addEventListener('click', () => modal.close());

            loginForm.addEventListener('submit', (e) => {
                const username = document.getElementById('username').value;
                const remember = document.getElementById('remember-me').checked;

                if (remember) {
                    localStorage.setItem('site_username', username);
                } else {
                    sessionStorage.setItem('site_username', username);
                }
                
                window.location.href = 'index.html';
            });
        }
    }


    // Manejo del formulario de registro
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

            // Si el usuario subió una foto, la procesamos
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        localStorage.setItem('site_user_avatar', e.target.result);
                        finalizarRegistro();
                    } catch (error) {
                        alert("La imagen es demasiado grande. Intenta con una más pequeña.");
                    }
                };
                
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                finalizarRegistro();
            }
        });
    }

    // Cargar contenido dinámico para la página principal
    loadHomeContent();
});

// Función para cargar el contenido de la página principal
async function loadHomeContent() {
    const carousel = document.getElementById('home-carousel');
    const destinosGrid = document.querySelector('.destinos-grid');
    
    // Solo cargar si existe alguno de estos elementos
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
        const response = await fetch('ciudades-del-mundo.json');
        if (!response.ok) {
            throw new Error('Error al cargar ciudades-del-mundo.json');
        }
        
        const data = await response.json();
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

        // Mezclar destinos aleatoriamente
        allDestinos.sort(() => Math.random() - 0.5);

        // Cargar carrusel (primeros 10)
        if (carousel) {
            const carouselDestinos = allDestinos.slice(0, 10);
            carousel.innerHTML = ''; // Limpiar antes de cargar
            
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
                            <span class="reviews">(${d.reviews})</span>
                        </div>
                    </div>
                `;
                carousel.appendChild(card);
            });

            // Funcionalidad de navegación del carrusel
            const prevBtn = document.querySelector('.carousel-nav.prev');
            const nextBtn = document.querySelector('.carousel-nav.next');
            
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => {
                    carousel.scrollBy({ left: -350, behavior: 'smooth' });
                });
                
                nextBtn.addEventListener('click', () => {
                    carousel.scrollBy({ left: 350, behavior: 'smooth' });
                });
            }
        }

        // Cargar grid (6 destinos seleccionados)
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
        
    } catch (error) {
        console.error("Error cargando destinos:", error);
        if (carousel) {
            carousel.innerHTML = "<p style='padding: 2rem; text-align: center;'>Error al cargar destinos</p>";
        }
        if (destinosGrid) {
            destinosGrid.innerHTML = "<p style='padding: 2rem; text-align: center;'>Error al cargar destinos</p>";
        }
    }
}
