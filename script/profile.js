document.addEventListener("DOMContentLoaded", () => {
    
    // Primero miramos si hay alguien conectado recuperando la sesión
    const username = localStorage.getItem("site_username") || sessionStorage.getItem("site_username");
    
    // Si no hay usuario, lo mandamos a la página de registro
    if (!username) {
        window.location.href = "signup.html";
        return;
    }

    // Recuperamos nuestra base de datos de usuarios para buscar al que está conectado
    const usersDB = JSON.parse(localStorage.getItem('database_users') || '[]');
    const currentUser = usersDB.find(u => u.username === username);

    // Referencias a los elementos de la página que vamos a rellenar
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

    // Mostramos el nombre del usuario
    nameDisplay.textContent = username;
    
    // Para la foto, intentamos coger la del registro primero. Si no tiene, usamos una por defecto
    let avatarSrc;
    if (currentUser && currentUser.avatar) {
        avatarSrc = currentUser.avatar;
    } else {
        // Por si acaso mantenemos compatibilidad con el sistema antiguo o generamos uno
        avatarSrc = localStorage.getItem("site_user_avatar") || 
                   `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
    }
    picDisplay.src = avatarSrc;

    // Hacemos lo mismo con el email: si viene del registro lo usamos, si no lo generamos
    let userEmail = "";
    if (currentUser && currentUser.email) {
        userEmail = currentUser.email;
    } else {
        // Si no tenemos email guardado, buscamos en el antiguo o creamos uno falso
        userEmail = localStorage.getItem("site_user_email_" + username) || 
                    `${username.toLowerCase().replace(/\s/g, '')}@example.com`;
    }
    
    // Rellenamos los campos de email
    emailInput.value = userEmail;
    emailDisplay.textContent = userEmail;

    // Cargamos el resto de datos personales si el usuario ya los había guardado antes
    const savedFullname = localStorage.getItem("site_user_fullname_" + username);
    const savedPhone = localStorage.getItem("site_user_phone_" + username);
    const savedCountry = localStorage.getItem("site_user_country_" + username);

    if (savedFullname) fullnameInput.value = savedFullname;
    if (savedPhone) phoneInput.value = savedPhone;
    if (savedCountry) countrySelect.value = savedCountry;

    // Guardamos automáticamente cualquier cambio que haga el usuario en estos campos
    fullnameInput.addEventListener("input", () => {
        const fullnameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}(?:[- ][A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}){2,}$/;

        if (!fullnameRegex.test(fullnameInput.value.trim())) {
            fullnameInput.style.border = "2px solid red";
        } else {
            fullnameInput.style.border = "2px solid green";
            localStorage.setItem("site_user_fullname_" + username, fullnameInput.value);
        }
    });
    
    phoneInput.addEventListener("input", () => {
        const phoneRegex = /^(?:\+34\s?)?[6789]\d{8}$/;

        if (!phoneRegex.test(phoneInput.value.trim())) {
            phoneInput.style.border = "2px solid red";
        } else {
            phoneInput.style.border = "2px solid green";
            localStorage.setItem("site_user_phone_" + username, phoneInput.value);
        }
    });
    
    countrySelect.addEventListener("change", () => {
        localStorage.setItem("site_user_country_" + username, countrySelect.value);
    });

    // Lógica para cuando el usuario quiere cambiar su foto de perfil
    changeAvatarBtn.addEventListener("click", () => {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const newImageBase64 = event.target.result;
                // Actualizamos la imagen en pantalla al momento
                picDisplay.src = newImageBase64;
                
                try {
                    // Guardamos la nueva foto en la base de datos de usuarios para que no se pierda
                    if (currentUser) {
                        currentUser.avatar = newImageBase64;
                        // Buscamos dónde está este usuario en la lista para actualizarlo
                        const userIndex = usersDB.findIndex(u => u.username === username);
                        if (userIndex !== -1) {
                            usersDB[userIndex] = currentUser;
                            localStorage.setItem('database_users', JSON.stringify(usersDB));
                        }
                    }
                    // También actualizamos la copia local por si acaso
                    localStorage.setItem("site_user_avatar", newImageBase64);
                } catch (error) {
                    alert("La imagen es muy grande, intenta con una más pequeña.");
                }
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Botón para cerrar sesión y limpiar credenciales activas
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("site_username");
        sessionStorage.removeItem("site_username");
        // Opcionalmente limpiamos el avatar temporal para que no salga en el login del siguiente
        localStorage.removeItem("site_user_avatar");
        window.location.href = "index.html";
    });

    // Controlamos las pestañas (tabs) de la interfaz si existen
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.dataset.tab;
            
            // Quitamos la clase activa a todas y se la ponemos a la clicada
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            item.classList.add('active');
            // Buscamos el contenido correspondiente asegurándonos que el elemento existe
            const targetTab = document.getElementById(`tab-${tabName}`);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // Si la URL dice que abramos una pestaña concreta, lo hacemos
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
        const targetNav = document.querySelector(`[data-tab="${tabParam}"]`);
        if (targetNav) {
            targetNav.click();
        }
    }

    // Función para leer y pintar las reservas guardadas
    function cargarReservas() {
        const reservasContainer = document.getElementById('reservas-container');
        const reservas = JSON.parse(localStorage.getItem(`reservas_${username}`) || '[]');
        
        // Si no hay nada, mostramos mensaje de vacío
        if (reservas.length === 0) {
            reservasContainer.innerHTML = '<p class="empty-state">No tienes reservas aún. <a href="destinos-destacados.html" style="color: #000; font-weight: 600;">Explora destinos</a></p>';
            return;
        }
        
        reservasContainer.innerHTML = '';
        
        // Mostramos las más recientes primero
        reservas.reverse().forEach(reserva => {
            const card = document.createElement('div');
            card.className = 'reserva-card';
            
            // Construimos la tarjeta con los datos de la reserva
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

        // Activamos los botones de cancelar
        document.querySelectorAll('.btn-cancel-reserva').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
                    // Filtramos para quitar la que coincide con el ID
                    const reservasActualizadas = reservas.filter(r => r.id !== id);
                    localStorage.setItem(`reservas_${username}`, JSON.stringify(reservasActualizadas));
                    // Recargamos la lista para que se vea el cambio
                    cargarReservas();
                }
            });
        });
    }

    // Función para leer y pintar las reseñas del usuario
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
            
            // Calculamos las estrellas visualmente
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

        // Activamos los botones de eliminar reseña
        document.querySelectorAll('.btn-delete-review').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
                    // Borramos usando el índice (ajustado porque invertimos el array visualmente)
                    reseñas.splice(reseñas.length - 1 - index, 1);
                    localStorage.setItem(`user_reviews_${username}`, JSON.stringify(reseñas));
                    cargarReseñas();
                }
            });
        });
    }

    // Ejecutamos las cargas iniciales
    cargarReservas();
    cargarReseñas();
});
