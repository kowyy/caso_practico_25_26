// Info de cada destino (Base de datos local + Fallback dinámico)
const destinosDataStatic = {
    // Para destinos estáticos
};

// Cargar info del destino según el parámetro URL
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const destinoId = urlParams.get("destino");

    // Helper slug (copiar de otros archivos o hacer un util común)
    function createSlug(text) {
        return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/^-+/, '').replace(/-+$/, '');
    }

    let data = destinosDataStatic[destinoId];

    // Si no está en estático, buscar en JSON
    if (!data && destinoId) {
        try {
            const response = await fetch('ciudades-del-mundo.json');
            const jsonData = await response.json();
            
            let foundCity = null;
            for (const cont of jsonData.continents) {
                for (const pais of cont.countries) {
                    const found = pais.cities.find(c => createSlug(c.name) === destinoId);
                    if (found) { foundCity = found; break; }
                }
                if (foundCity) break;
            }

            if (foundCity) {
                // Generar datos faltantes
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

    if (data) {
        document.getElementById("destino-nombre").textContent = data.nombre;
        document.getElementById("destino-precio").textContent = data.precio;
        const img = document.getElementById("destino-img");
        if(img) {
            img.src = data.imagen;
            img.alt = data.nombre;
        }

        const listaIncluye = document.getElementById("destino-incluye");
        if(listaIncluye) {
            listaIncluye.innerHTML = "";
            data.incluye.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                listaIncluye.appendChild(li);
            });
        }
    } else {
        document.getElementById("destino-nombre").textContent = "Destino no seleccionado";
    }
});

// Gestión de acompañantes
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
                <input type="text" class="companion-name" placeholder="Nombre completo" required>
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

// Mostrar/ocultar campos de mascota
const mascotaToggle = document.getElementById("mascota-toggle");
if(mascotaToggle) {
    mascotaToggle.addEventListener("change", function() {
        const petFields = document.getElementById("mascota-fields");
        petFields.style.display = this.checked ? "block" : "none";
    });
}

// Mostrar/ocultar campos de alergias
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

// Procesar el formulario de compra
const buyForm = document.getElementById("buy-form");
if(buyForm) {
    buyForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const username = localStorage.getItem('site_username') || sessionStorage.getItem('site_username');
        
        if (!username) {
            alert('Debes iniciar sesión para completar la reserva');
            window.location.href = 'index.html';
            return;
        }

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

        // Obtener info del destino
        const destinoNombre = document.getElementById("destino-nombre").textContent;
        const destinoPrecio = document.getElementById("destino-precio").textContent;
        const destinoImg = document.getElementById("destino-img").src;

        // Crear objeto de reserva
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

        // Guardar en localStorage
        const reservasExistentes = JSON.parse(localStorage.getItem(`reservas_${username}`) || '[]');
        reservasExistentes.push(reserva);
        localStorage.setItem(`reservas_${username}`, JSON.stringify(reservasExistentes));

        // Mostrar confirmación
        mostrarConfirmacionReserva(reserva);
    });
}

function mostrarConfirmacionReserva(reserva) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '10000';

    const modal = document.createElement('div');
    modal.style.backgroundColor = 'white';
    modal.style.padding = '2.5rem';
    modal.style.borderRadius = '12px';
    modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    modal.style.textAlign = 'center';
    modal.style.minWidth = '400px';
    modal.style.maxWidth = '90%';

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
        <button id="btn-ver-reservas" style="background: #000; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; margin-right: 10px;">
            Ver mis reservas
        </button>
        <button id="btn-volver-inicio" style="background: #fff; color: #000; border: 1px solid #ccc; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer;">
            Volver al inicio
        </button>
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

// Formateo automático del número de tarjeta
const cardInput = document.getElementById("card-number");
if(cardInput) {
    cardInput.addEventListener("input", function(e) {
        let value = e.target.value.replace(/\s/g, "");
        let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
        e.target.value = formattedValue;
    });
}
