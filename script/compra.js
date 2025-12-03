const companionsList = document.getElementById("companions-list");
const addCompanionBtn = document.getElementById("add-companion");

let companionCount = 0;
const maxCompanions = 7; // Límite de 7 acompañantes junto al titular

// Para ir añadiendo acompañantes
addCompanionBtn.addEventListener("click", () => {
    if (companionCount >= maxCompanions) {
        alert("Máximo 8 personas por reserva.");
        return;
    }

    companionCount++;

    const box = document.createElement("div");
    box.classList.add("companion-box");

    box.innerHTML = `
        <label>Nombre del acompañante</label>
        <input type="text" class="companion-name" placeholder="Nombre completo" required>

        <label>Correo electrónico</label>
        <input type="email" class="companion-email" placeholder="correo@mail.com" required>

        <button type="button" class="remove-companion">Eliminar</button>
    `;

    // Botón para eliminar acompañante
    box.querySelector(".remove-companion").addEventListener("click", () => {
        box.remove();
        companionCount--;
    });

    companionsList.appendChild(box);
});

// Mascotas
document.getElementById("mascota-toggle").addEventListener("change", function() {
    const petFields = document.getElementById("mascota-fields");
    petFields.style.display = this.checked ? "block" : "none";
});

// Alergias
const noAllergies = document.getElementById("no-allergies");
const allergyText = document.getElementById("allergy-text");

noAllergies.addEventListener("change", () => {
    if (noAllergies.checked) {
        allergyText.value = "";
        allergyText.disabled = true;
    } else {
        allergyText.disabled = false;
    }
});

// Estructura del formulario de compra
document.getElementById("buy-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const titulares = {
        nombre: fullname.value,
        email: email.value
    };

    const acompanantes = [...document.querySelectorAll(".companion-box")].map(box => ({
        nombre: box.querySelector(".companion-name").value,
        email: box.querySelector(".companion-email").value
    }));

    const mascota = document.getElementById("mascota-toggle").checked
        ? {
            tipo: pet-type.value,
            tamaño: pet-size.value
        }
        : null;

    const alergias = noAllergies.checked ? "Ninguna" : allergyText.value.trim();

    alert("Reserva realizada correctamente.\n\n" +
          "Titular: " + titulares.nombre + "\n" +
          "Acompañantes: " + acompanantes.length + "\n" +
          "Mascota: " + (mascota ? mascota.tipo + " (" + mascota.tamaño + ")" : "No") + "\n" +
          "Alergias: " + alergias);
});
