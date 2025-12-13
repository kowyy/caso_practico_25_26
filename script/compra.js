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
    
    getUsers() {
        const data = this.get('database_users');
        return data ? JSON.parse(data) : [];
    }
};

const destinosDataStatic = {};

document.addEventListener("DOMContentLoaded", async () => {
    
    // Pre-llenado del formulario si el usuario está logueado y bloqueo de email
    const activeUser = CookieAuth.get('site_username');
    
    if (activeUser) {
        const nameInput = document.getElementById("fullname");
        const emailInput = document.getElementById("email");

        if (nameInput && emailInput) {
            const usersDB = CookieAuth.getUsers();
            const currentUser = usersDB.find(u => u.username === activeUser);
            
            const savedName = CookieAuth.get("site_user_fullname_" + activeUser);
            nameInput.value = savedName || activeUser;

            let savedEmail = "";
            if (currentUser && currentUser.email) {
                savedEmail = currentUser.email;
            } else {
                savedEmail = CookieAuth.get("site_user_email_" + activeUser) || 
                             `${activeUser.toLowerCase().replace(/\s/g, '')}@example.com`;
            }
            emailInput.value = savedEmail;
            
            // UX: Email en modo solo lectura para usuarios registrados
            emailInput.readOnly = true;
            emailInput.style.backgroundColor = "#f9f9f9";
            emailInput.style.cursor = "not-allowed";
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const purchaseType = urlParams.get("type");
    const destinoId = urlParams.get("destino");

    let data = null;

    // Lógica para separar compra de Experiencias vs Destinos normales
    if (purchaseType === 'experience') {
        const storedData = CookieAuth.get('purchase_data');
        if (storedData) {
            data = JSON.parse(storedData);
        } else {
            window.location.href = 'experiencias.html';
            return;
        }
    } else {
        function createSlug(text) {
            return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/^-+/, '').replace(/-+$/, '');
        }

        data = destinosDataStatic[destinoId];

        // Fetch dinámico de datos de la ciudad si no está en caché estático
        if (!data && destinoId) {
            try {
                const jsonData = CIUDADES_DATA;
                
                let foundCity = null;
                for (const cont of jsonData.continents) {
                    for (const pais of cont.countries) {
                        const found = pais.cities.find(c => createSlug(c.name) === destinoId);
                        if (found) { foundCity = found; break; }
                    }
                    if (foundCity) break;
                }

                if (foundCity) {
                    let hash = 0;
                    for (let i = 0; i < foundCity.name.length; i++) hash = foundCity.name.charCodeAt(i) + ((hash << 5) - hash);
                    const precioCalc = 500 + (Math.abs(hash) % 1500);

                    data = {
                        nombre: foundCity.name,
                        precio: precioCalc + "€",
                        imagen: foundCity.image.url,
                        incluye: [
                            "Vuelo ida y vuelta",
                            "Alojamiento céntrico",
                            "Desayunos incluidos",
                            "Seguro de viaje"
                        ]
                    };
                }
            } catch (e) {
                console.error("Error fetching dynamic data for purchase", e);
            }
        }
    }

    // Renderizado del resumen de compra
    if (data) {
        document.getElementById("destino-nombre").textContent = data.nombre;
        document.getElementById("destino-precio").textContent = data.precio;
        const img = document.getElementById("destino-img");
        if(img) {
            let imgUrl = data.imagen;
            if (imgUrl.includes("images.unsplash.com")) {
                imgUrl = imgUrl.replace("w=500", "w=800"); 
            }
            img.src = imgUrl;
            img.alt = data.nombre;
        }

        const listaIncluye = document.getElementById("destino-incluye");
        if(listaIncluye && data.incluye) {
            listaIncluye.innerHTML = "";
            data.incluye.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                listaIncluye.appendChild(li);
            });
        }
    } else {
        const nombreEl = document.getElementById("destino-nombre");
        if(nombreEl) nombreEl.textContent = "Destino no seleccionado";
    }
});

// Manejo dinámico de campos para acompañantes (DOM Injection)
const companionsList = document.getElementById("companions-list");
const addCompanionBtn = document.getElementById("add-companion");

let companionCount = 0;
const maxCompanions = 7;

if (addCompanionBtn) {
    addCompanionBtn.addEventListener("click", () => {
        if (companionCount >= maxCompanions) {
            alert("Máximo 8 personas por reserva (titular + 7 acompañantes).");
            return;
        }

        companionCount++;

        const box = document.createElement("div");
        box.classList.add("companion-box");

        box.innerHTML = `
            <h4>Acompañante ${companionCount}</h4>
            <div class="form-group">
                <label>Nombre completo</label>
                <input type="text" class="companion-name" placeholder="Nombre y apellidos" required>
            </div>
            <div class="form-group">
                <label>Correo electrónico</label>
                <input type="email" class="companion-email" placeholder="correo@mail.com" required>
            </div>
            <button type="button" class="btn-remove">Eliminar</button>
        `;

        box.querySelector(".btn-remove").addEventListener("click", () => {
            box.remove();
            companionCount--;
            actualizarNumerosAcompañantes();
        });

        companionsList.appendChild(box);
        actualizarNumerosAcompañantes();
    });
}

function actualizarNumerosAcompañantes() {
    const boxes = companionsList.querySelectorAll(".companion-box");
    boxes.forEach((box, index) => {
        box.querySelector("h4").textContent = `Acompañante ${index + 1}`;
    });
    companionCount = boxes.length;
}

// Toggles visuales para secciones opcionales (mascotas/alergias)
const mascotaToggle = document.getElementById("mascota-toggle");
if(mascotaToggle) {
    mascotaToggle.addEventListener("change", function() {
        const petFields = document.getElementById("mascota-fields");
        petFields.style.display = this.checked ? "block" : "none";
    });
}

const allergyToggle = document.getElementById("allergy-toggle");
const allergyFields = document.getElementById("allergy-fields");
const allergyText = document.getElementById("allergy-text");

if (allergyToggle) {
    allergyToggle.addEventListener("change", () => {
        const show = allergyToggle.checked;
        allergyFields.style.display = show ? "block" : "none";

        if (!show) {
            allergyText.value = "";
        }
    });
}

// Validación y procesamiento final del formulario de compra
const buyForm = document.getElementById("buy-form");
if(buyForm) {
    buyForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Regex estrictas para validación financiera y de datos personales
        const fullNameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}(?:[-\s][A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}){2,}$/;
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const cardNumberRegex = /^\d{16}$/;
        const monthRegex = /^(0[1-9]|1[0-2])$/;
        const cvvRegex = /^\d{3}$/;

        const fullnameInput = document.getElementById("fullname");
        const emailInput = document.getElementById("email");
        const cardNumberInput = document.getElementById("card-number");
        const expMonthInput = document.getElementById("exp-month");
        const expYearInput = document.getElementById("exp-year");
        const cvvInput = document.getElementById("cvv");

        if (!fullNameRegex.test(fullnameInput.value.trim())) {
            alert("Introduce un nombre y dos apellidos válidos.");
            return;
        }

        if (!emailRegex.test(emailInput.value.trim())) {
            alert("Introduce un correo electrónico válido.");
            return;
        }

        const companions = document.querySelectorAll(".companion-box");
        for (const comp of companions) {
            const name = comp.querySelector(".companion-name");
            const mail = comp.querySelector(".companion-email");

            if (!fullNameRegex.test(name.value.trim())) {
                alert("Nombre de acompañante inválido.");
                return;
            }

            if (!emailRegex.test(mail.value.trim())) {
                alert("Email de acompañante inválido.");
                return;
            }
        }

        const cleanCardNumber = cardNumberInput.value.replace(/\s/g, "");
        if (!cardNumberRegex.test(cleanCardNumber)) {
            alert("Número de tarjeta inválido. Deben ser 16 dígitos.");
            return;
        }

        if (!monthRegex.test(expMonthInput.value.trim())) {
            alert("Introduce un mes de expiración válido (01-12).");
            return;
        }

        const currentYear = new Date().getFullYear() % 100;
        const expYear = parseInt(expYearInput.value.trim());

        if (isNaN(expYear) || expYear < currentYear) {
            alert("La tarjeta está expirada o el año es inválido.");
            return;
        }

        if (!cvvRegex.test(cvvInput.value.trim())) {
            alert("CVV inválido. Debe tener 3 dígitos.");
            return;
        }

        const username = CookieAuth.get('site_username');
        
        if (!username) {
            alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
            window.location.href = 'index.html';
            return;
        }

        // Construcción del objeto de reserva
        const titular = {
            nombre: document.getElementById("fullname").value,
            email: document.getElementById("email").value
        };

        const acompañantes = [...document.querySelectorAll(".companion-box")].map(box => ({
            nombre: box.querySelector(".companion-name").value,
            email: box.querySelector(".companion-email").value
        }));

        const mascota = document.getElementById("mascota-toggle").checked
            ? {
                tipo: document.getElementById("pet-type").value,
                tamaño: document.getElementById("pet-size").value
            }
            : null;

        const alergias = allergyToggle.checked ? allergyText.value.trim() : "Ninguna";

        const destinoNombre = document.getElementById("destino-nombre").textContent;
        const destinoPrecio = document.getElementById("destino-precio").textContent;
        const destinoImg = document.getElementById("destino-img").src;

        const reserva = {
            id: Date.now(),
            fecha: new Date().toLocaleDateString('es-ES'),
            destino: destinoNombre,
            precio: destinoPrecio,
            imagen: destinoImg,
            titular: titular,
            acompañantes: acompañantes,
            mascota: mascota,
            alergias: alergias,
            estado: 'Confirmada'
        };

        // Persistencia en cookie serializada (simulación de DB)
        const reservasExistentes = JSON.parse(CookieAuth.get(`reservas_${username}`) || '[]');
        reservasExistentes.push(reserva);
        CookieAuth.set(`reservas_${username}`, JSON.stringify(reservasExistentes));

        mostrarConfirmacionReserva(reserva);
    });
}

function mostrarConfirmacionReserva(reserva) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:10000;';

    const modal = document.createElement('div');
    modal.style.cssText = 'background:white; padding:2.5rem; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.2); text-align:center; min-width:400px; max-width:90%;';

    modal.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" style="margin-bottom: 1rem;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h2 style="margin: 0 0 0.5rem 0; color: #4CAF50;">¡Reserva confirmada!</h2>
        <p style="color: #666; margin-bottom: 1.5rem;">Tu viaje a <strong>${reserva.destino}</strong> ha sido reservado exitosamente</p>
        <div style="background: #f9f9f9; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: left;">
            <p style="margin: 0.5rem 0;"><strong>Titular:</strong> ${reserva.titular.nombre}</p>
            <p style="margin: 0.5rem 0;"><strong>Email:</strong> ${reserva.titular.email}</p>
            <p style="margin: 0.5rem 0;"><strong>Acompañantes:</strong> ${reserva.acompañantes.length}</p>
            <p style="margin: 0.5rem 0;"><strong>Fecha:</strong> ${reserva.fecha}</p>
        </div>
        <div style="display:flex; gap:10px; justify-content:center;">
            <button id="btn-ver-reservas" style="background: #000; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                Ver mis reservas
            </button>
            <button id="btn-volver-inicio" style="background: #fff; color: #000; border: 1px solid #ccc; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                Volver al inicio
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('btn-ver-reservas').onclick = () => {
        window.location.href = 'mi-perfil.html?tab=reservas';
    };

    document.getElementById('btn-volver-inicio').onclick = () => {
        window.location.href = 'index.html';
    };
}

// Formateador visual para números de tarjeta (grupos de 4)
const cardInput = document.getElementById("card-number");
if(cardInput) {
    cardInput.addEventListener("input", function(e) {
        let value = e.target.value.replace(/\s/g, "");
        if (value.length > 16) value = value.substring(0, 16);
        let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
        e.target.value = formattedValue;
    });
}
