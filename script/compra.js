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

        // Simular confirmación de reserva
        alert(
            "¡Reserva realizada correctamente!\n\n" +
            "Titular: " + titular.nombre + "\n" +
            "Acompañantes: " + acompañantes.length + "\n" +
            "Mascota: " + (mascota ? mascota.tipo + " (" + mascota.tamaño + ")" : "No") + "\n" +
            "Alergias: " + alergias
        );

        console.log({ titular, acompañantes, mascota, alergias });
    });
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
