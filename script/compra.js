// Info de cada destino
const destinosData = {
    petra: {
        nombre: "Petra",
        precio: "120€",
        imagen: "images/petra.jpeg",
        incluye: [
            "Vuelo ida y vuelta",
            "Hotel de 4 estrellas - 3 noches",
            "Entrada al Tesoro y Monasterio",
            "Guía turístico local"
        ]
    },
    "las-vegas": {
        nombre: "Las Vegas",
        precio: "150€",
        imagen: "images/vegas.jpeg",
        incluye: [
            "Vuelo ida y vuelta",
            "Hotel 5 estrellas - 4 noches",
            "Entradas a espectáculos seleccionados",
            "Paseo nocturno por el Strip"
        ]
    },
    "puerto-rico": {
        nombre: "Puerto Rico",
        precio: "180€",
        imagen: "images/puerto-rico.jpeg",
        incluye: [
            "Vuelo ida y vuelta",
            "Hotel en primera línea de playa - 5 noches",
            "Excursión por El Yunque",
            "Visita al Viejo San Juan"
        ]
    },
    "paris": {
        nombre: "París",
        precio: "950€",
        imagen: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
        incluye: [
            "Vuelo ida y vuelta",
            "Hotel céntrico - 3 noches",
            "Entrada al Louvre",
            "Cena en crucero por el Sena"
        ]
    },
    "kioto": {
        nombre: "Kioto",
        precio: "1.450€",
        imagen: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
        incluye: [
            "Vuelo ida y vuelta",
            "Ryokan tradicional - 5 noches",
            "Ceremonia del té",
            "Paseo por Gion y templos"
        ]
    },
    "nueva-york": {
        nombre: "Nueva York",
        precio: "1.100€",
        imagen: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
        incluye: [
            "Vuelo directo",
            "Hotel en Manhattan - 4 noches",
            "Entrada al Empire State",
            "Tour en barco estatua libertad"
        ]
    }
};

// Cargar info del destino según el parámetro URL
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const destino = urlParams.get("destino");

    if (destino && destinosData[destino]) {
        const data = destinosData[destino];
        
        document.getElementById("destino-nombre").textContent = data.nombre;
        document.getElementById("destino-precio").textContent = data.precio;
        document.getElementById("destino-img").src = data.imagen;
        document.getElementById("destino-img").alt = data.nombre;

        const listaIncluye = document.getElementById("destino-incluye");
        listaIncluye.innerHTML = "";
        data.incluye.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            listaIncluye.appendChild(li);
        });
    }
});

// Gestión de acompañantes
const companionsList = document.getElementById("companions-list");
const addCompanionBtn = document.getElementById("add-companion");

let companionCount = 0;
const maxCompanions = 7;

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

    // Botón para quitar este acompañante
    box.querySelector(".btn-remove").addEventListener("click", () => {
        box.remove();
        companionCount--;
        actualizarNumerosAcompañantes();
    });

    companionsList.appendChild(box);
    actualizarNumerosAcompañantes();
});

// Actualizar el número de cada acompañante después de eliminar alguno
function actualizarNumerosAcompañantes() {
    const boxes = companionsList.querySelectorAll(".companion-box");
    boxes.forEach((box, index) => {
        box.querySelector("h4").textContent = `Acompañante ${index + 1}`;
    });
    companionCount = boxes.length;
}

// Mostrar/ocultar campos de mascota
document.getElementById("mascota-toggle").addEventListener("change", function() {
    const petFields = document.getElementById("mascota-fields");
    petFields.style.display = this.checked ? "block" : "none";
});

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
document.getElementById("buy-form").addEventListener("submit", function(e) {
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

    // Aquí podrías guardar en localStorage o enviar a un servidor
    console.log({ titular, acompañantes, mascota, alergias });
});

// Formateo automático del número de tarjeta
document.getElementById("card-number").addEventListener("input", function(e) {
    let value = e.target.value.replace(/\s/g, "");
    let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
    e.target.value = formattedValue;
});
