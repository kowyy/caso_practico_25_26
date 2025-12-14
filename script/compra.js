const AuthService = {
    checkSession: function() {
        return sessionStorage.getItem("login_valido") === "true";
    },
    getCurrentUser: function() {
        return sessionStorage.getItem("usuario_activo");
    },
    getData: function(key) {
        return localStorage.getItem(key);
    },
    saveData: function(key, value) {
        localStorage.setItem(key, value);
    },
    getUsers: function() {
        const users = localStorage.getItem("usuarios");
        return users ? JSON.parse(users) : [];
    }
};

const destinosDataStatic = {};

document.addEventListener("DOMContentLoaded", async () => {
    
    // Validar sesión antes de permitir comprar
    const activeUser = AuthService.getCurrentUser();
    
    if (activeUser && AuthService.checkSession()) {
        const nameInput = document.getElementById("fullname");
        const emailInput = document.getElementById("email");

        if (nameInput && emailInput) {
            const usersDB = AuthService.getUsers();
            const currentUser = usersDB.find(u => u.username === activeUser);
            
            const savedName = AuthService.getData("user_fullname_" + activeUser);
            nameInput.value = savedName || activeUser;

            let savedEmail = "";
            if (currentUser && currentUser.email) {
                savedEmail = currentUser.email;
            } else {
                savedEmail = `${activeUser.toLowerCase()}@example.com`;
            }
            emailInput.value = savedEmail;
            
            emailInput.readOnly = true;
            emailInput.style.backgroundColor = "#f9f9f9";
        }
    } else {
        // Si no hay sesión, redirigimos al login o inicio
        alert("Debes iniciar sesión para realizar una reserva.");
        window.location.href = "index.html";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const purchaseType = urlParams.get("type");
    const destinoId = urlParams.get("destino");

    let data = null;

    if (purchaseType === 'experience') {
        // Para experiencias, leemos de sessionStorage temporal
        const storedData = sessionStorage.getItem('purchase_data');
        if (storedData) {
            data = JSON.parse(storedData);
        }
    } else {
        function createSlug(text) {
            return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/^-+/, '').replace(/-+$/, '');
        }

        data = destinosDataStatic[destinoId];

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
                        incluye: ["Vuelo ida y vuelta", "Alojamiento céntrico", "Seguro de viaje"]
                    };
                }
            } catch (e) {
                console.error("Error data", e);
            }
        }
    }

    if (data) {
        document.getElementById("destino-nombre").textContent = data.nombre;
        document.getElementById("destino-precio").textContent = data.precio;
        const img = document.getElementById("destino-img");
        if(img) {
            img.src = data.imagen.includes("images.unsplash.com") ? data.imagen.replace("w=500", "w=800") : data.imagen;
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
    }
});

// Manejo de acompañantes
const companionsList = document.getElementById("companions-list");
const addCompanionBtn = document.getElementById("add-companion");
let companionCount = 0;

if (addCompanionBtn) {
    addCompanionBtn.addEventListener("click", () => {
        if (companionCount >= 7) return;
        companionCount++;
        const box = document.createElement("div");
        box.classList.add("companion-box");
        box.innerHTML = `
            <h4>Acompañante ${companionCount}</h4>
            <div class="form-group"><input type="text" class="companion-name" placeholder="Nombre" required></div>
            <div class="form-group"><input type="email" class="companion-email" placeholder="Email" required></div>
            <button type="button" class="btn-remove">Eliminar</button>
        `;
        box.querySelector(".btn-remove").addEventListener("click", () => {
            box.remove();
            companionCount--;
        });
        companionsList.appendChild(box);
    });
}

// Proceso de compra
const buyForm = document.getElementById("buy-form");
if(buyForm) {
    buyForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const username = AuthService.getCurrentUser();
        if (!username || !AuthService.checkSession()) {
            alert('Sesión expirada.');
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

        const reserva = {
            id: Date.now(),
            fecha: new Date().toLocaleDateString('es-ES'),
            destino: document.getElementById("destino-nombre").textContent,
            precio: document.getElementById("destino-precio").textContent,
            imagen: document.getElementById("destino-img").src,
            titular: titular,
            acompañantes: acompañantes,
            estado: 'Confirmada'
        };

        // Persistencia en localStorage usando la nueva lógica
        const reservasExistentes = JSON.parse(AuthService.getData(`reservas_${username}`) || '[]');
        reservasExistentes.push(reserva);
        AuthService.saveData(`reservas_${username}`, JSON.stringify(reservasExistentes));

        alert("¡Reserva confirmada!");
        window.location.href = "mi-perfil.html";
    });
}

// Formato tarjeta
const cardInput = document.getElementById("card-number");
if(cardInput) {
    cardInput.addEventListener("input", function(e) {
        let value = e.target.value.replace(/\s/g, "").substring(0, 16);
        e.target.value = value.match(/.{1,4}/g)?.join(" ") || value;
    });
}
