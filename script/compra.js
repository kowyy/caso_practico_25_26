// Esta variable es solo para esta página
const destinosDataStatic = {};

document.addEventListener("DOMContentLoaded", async () => {
    
    // Validar sesión
    if (!SessionManager.isLoggedIn()) {
        alert("Debes iniciar sesión para realizar una reserva.");
        CookieAuth.set('return_url', window.location.href, 1);
        window.location.href = "signup.html?mode=login";
        return;
    }
    
    const username = SessionManager.getCurrentUser();
    const userData = UserManager.getUserData(username);
    
    // Autocompletar datos del usuario
    const nameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");
    
    if (nameInput && emailInput && userData) {
        nameInput.value = userData.fullname || username;
        emailInput.value = userData.email || '';
        emailInput.readOnly = true;
        emailInput.style.backgroundColor = "#f9f9f9";
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const purchaseType = urlParams.get("type");
    const destinoId = urlParams.get("destino");
    
    let data = null;
    
    // Determinar tipo de compra
    if (purchaseType === 'experience') {
        // Para experiencias, leemos de sessionStorage
        const storedData = sessionStorage.getItem('purchase_data');
        if (storedData) {
            data = JSON.parse(storedData);
        }
    } else {
        // Para destinos, buscamos en los datos
        function createSlug(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        }
        
        data = destinosDataStatic[destinoId];
        
        if (!data && destinoId) {
            try {
                const jsonData = CIUDADES_DATA;
                let foundCity = null;
                
                for (const cont of jsonData.continents) {
                    for (const pais of cont.countries) {
                        const found = pais.cities.find(c => createSlug(c.name) === destinoId);
                        if (found) {
                            foundCity = found;
                            break;
                        }
                    }
                    if (foundCity) break;
                }
                
                if (foundCity) {
                    let hash = 0;
                    for (let i = 0; i < foundCity.name.length; i++) {
                        hash = foundCity.name.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    const precioCalc = 500 + (Math.abs(hash) % 1500);
                    
                    data = {
                        nombre: foundCity.name,
                        precio: precioCalc + "€",
                        imagen: foundCity.image.url,
                        incluye: [
                            "Vuelo ida y vuelta",
                            "Alojamiento céntrico",
                            "Seguro de viaje"
                        ]
                    };
                }
            } catch (e) {
                console.error("Error cargando datos del destino:", e);
            }
        }
    }
    
    // Mostrar datos del destino/experiencia
    if (data) {
        const nombreEl = document.getElementById("destino-nombre");
        const precioEl = document.getElementById("destino-precio");
        const imgEl = document.getElementById("destino-img");
        const incluyeEl = document.getElementById("destino-incluye");
        
        if (nombreEl) nombreEl.textContent = data.nombre;
        if (precioEl) precioEl.textContent = data.precio;
        
        if (imgEl) {
            imgEl.src = data.imagen.includes("images.unsplash.com") 
                ? data.imagen.replace("w=500", "w=800") 
                : data.imagen;
        }
        
        if (incluyeEl && data.incluye) {
            incluyeEl.innerHTML = "";
            data.incluye.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                incluyeEl.appendChild(li);
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
        if (companionCount >= 7) {
            alert("Máximo 7 acompañantes");
            return;
        }
        companionCount++;
        
        const box = document.createElement("div");
        box.classList.add("companion-box");
        box.innerHTML = `
            <h4>Acompañante ${companionCount}</h4>
            <div class="form-group">
                <input type="text" class="companion-name" placeholder="Nombre completo" required>
            </div>
            <div class="form-group">
                <input type="email" class="companion-email" placeholder="Email" required>
            </div>
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
if (buyForm) {
    buyForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Validaciones
        const fullnameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}(?:[-\s][A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}){2,}$/;
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
        
        // Validar titular
        if (!fullnameRegex.test(fullnameInput.value.trim())) {
            alert("Introduce nombre y dos apellidos válidos.");
            fullnameInput.style.border = "2px solid red";
            return;
        }
        fullnameInput.style.border = "";
        
        if (!emailRegex.test(emailInput.value.trim())) {
            alert("Introduce un email válido.");
            emailInput.style.border = "2px solid red";
            return;
        }
        emailInput.style.border = "";
        
        // Validar acompañantes
        const companions = document.querySelectorAll(".companion-box");
        for (const comp of companions) {
            const name = comp.querySelector(".companion-name");
            const mail = comp.querySelector(".companion-email");
            
            if (!fullnameRegex.test(name.value.trim())) {
                alert("Nombre de acompañante inválido.");
                name.style.border = "2px solid red";
                return;
            }
            name.style.border = "";
            
            if (!emailRegex.test(mail.value.trim())) {
                alert("Email de acompañante inválido.");
                mail.style.border = "2px solid red";
                return;
            }
            mail.style.border = "";
        }
        
        // Validar tarjeta
        const cleanCardNumber = cardNumberInput.value.replace(/\s/g, "");
        if (!cardNumberRegex.test(cleanCardNumber)) {
            alert("Número de tarjeta inválido (16 dígitos).");
            cardNumberInput.style.border = "2px solid red";
            return;
        }
        cardNumberInput.style.border = "";
        
        if (!monthRegex.test(expMonthInput.value.trim())) {
            alert("Mes de expiración inválido (01-12).");
            expMonthInput.style.border = "2px solid red";
            return;
        }
        expMonthInput.style.border = "";
        
        const currentYear = new Date().getFullYear() % 100;
        const expYear = parseInt(expYearInput.value.trim());
        if (isNaN(expYear) || expYear < currentYear) {
            alert("Año de expiración inválido.");
            expYearInput.style.border = "2px solid red";
            return;
        }
        expYearInput.style.border = "";
        
        if (!cvvRegex.test(cvvInput.value.trim())) {
            alert("CVV inválido (3 dígitos).");
            cvvInput.style.border = "2px solid red";
            return;
        }
        cvvInput.style.border = "";
        
        // Verificar sesión
        const username = SessionManager.getCurrentUser();
        if (!username || !SessionManager.isLoggedIn()) {
            alert('Sesión expirada.');
            window.location.href = 'index.html';
            return;
        }
        
        // Recopilar datos
        const titular = {
            nombre: fullnameInput.value.trim(),
            email: emailInput.value.trim()
        };
        
        const acompañantes = [...companions].map(box => ({
            nombre: box.querySelector(".companion-name").value.trim(),
            email: box.querySelector(".companion-email").value.trim()
        }));
        
        const reserva = {
            destino: document.getElementById("destino-nombre").textContent,
            precio: document.getElementById("destino-precio").textContent,
            imagen: document.getElementById("destino-img").src,
            titular: titular,
            acompañantes: acompañantes
        };
        
        // Guardar reserva con cookies
        ReservasManager.addReserva(username, reserva);
        
        alert("¡Reserva confirmada!");
        window.location.href = "mi-perfil.html";
    });
}

// Formato de tarjeta
const cardInput = document.getElementById("card-number");
if (cardInput) {
    cardInput.addEventListener("input", function(e) {
        let value = e.target.value.replace(/\s/g, "").substring(0, 16);
        e.target.value = value.match(/.{1,4}/g)?.join(" ") || value;
    });
}
