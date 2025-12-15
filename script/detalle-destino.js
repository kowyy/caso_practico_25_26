document.addEventListener("DOMContentLoaded", async () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const destinoId = urlParams.get("id");

    if (!destinoId) {
        document.getElementById("page-title").textContent = "Error: No se encontró el destino";
        return;
    }

    document.body.setAttribute("data-destino", destinoId);

    function createSlug(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    let data = null;

    try {
        const jsonData = CIUDADES_DATA;
        let foundCity = null;
        let foundCountry = null;

        for (const cont of jsonData.continents) {
            for (const pais of cont.countries) {
                const found = pais.cities.find(c => createSlug(c.name) === destinoId);
                if (found) { 
                    foundCity = found; 
                    foundCountry = pais.name;
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
            const ratingCalc = (3 + (Math.abs(hash) % 21) / 10).toFixed(1);
            const reviewsCalc = 50 + (Math.abs(hash) % 450);

            data = {
                nombre: foundCity.name,
                pais: foundCountry,
                descripcion: foundCity.description,
                precio: precioCalc,
                imagen: foundCity.image.url,
                rating: ratingCalc,
                reviews: reviewsCalc,
                incluye: [
                    "Vuelo ida y vuelta", 
                    "Alojamiento céntrico 4★", 
                    "Seguro de viaje básico", 
                    "Traslados aeropuerto"
                ],
                imagenes: foundCity.carousel_images || [foundCity.image.url]
            };
        }
    } catch (e) {

    }

    if (data) {
        document.title = `${data.nombre} - Viajes y Experiencias`;
        
        const titleEl = document.getElementById("page-title");
        if(titleEl) titleEl.textContent = data.nombre;
        
        const countryEl = document.getElementById("page-country");
        if(countryEl) countryEl.textContent = data.pais;
        
        const descEl = document.getElementById("page-description");
        if(descEl) descEl.textContent = data.descripcion;

        const priceEl = document.getElementById("page-price");
        if(priceEl) priceEl.textContent = `${data.precio}€`;

        const starsEl = document.getElementById("summary-stars");
        const scoreEl = document.getElementById("summary-score");
        const countEl = document.getElementById("summary-count");
        
        if (starsEl) {
            const ratingNum = Math.round(data.rating);
            starsEl.textContent = "★".repeat(ratingNum) + "☆".repeat(5 - ratingNum);
        }
        if (scoreEl) scoreEl.textContent = data.rating;
        if (countEl) countEl.textContent = `(${data.reviews} reseñas)`;

        const listaIncluye = document.getElementById("page-includes");
        if(listaIncluye && data.incluye) {
            listaIncluye.innerHTML = "";
            data.incluye.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                listaIncluye.appendChild(li);
            });
        }

        const carruselTrack = document.getElementById("dynamic-carrusel");
        if (carruselTrack) {
            carruselTrack.innerHTML = "";
            const imagenes = data.imagenes && data.imagenes.length > 0 
                ? data.imagenes 
                : [data.imagen, data.imagen, data.imagen];
            
            imagenes.forEach(imgUrl => {
                const img = document.createElement("img");
                img.src = imgUrl;
                img.alt = data.nombre;
                carruselTrack.appendChild(img);
            });

            if (window.initCarrusel) {
                window.initCarrusel();
            }
        }
    }

    const btnReservar = document.getElementById('btn-reservar');
    if (btnReservar) {
        btnReservar.addEventListener('click', () => {
            if (typeof AuthService !== 'undefined' && !AuthService.checkSession()) {
                sessionStorage.setItem("return_to", window.location.href);
                window.location.href = "signup.html?mode=login";
            } else {
                window.location.href = `compra.html?destino=${destinoId}`;
            }
        });
    }
});
