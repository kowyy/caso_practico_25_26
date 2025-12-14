document.addEventListener("DOMContentLoaded", async () => {
    
    // Primero miramos la URL para averiguar qué destino quiere ver el usuario
    const urlParams = new URLSearchParams(window.location.search);
    const destinoId = urlParams.get("id");

    if (!destinoId) {
        console.error("No se ha especificado un ID de destino");
        return;
    }

    // Pequeña utilidad para limpiar textos y poder comparar nombres sin problemas de acentos o espacios
    function createSlug(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    let data = null;

    try {
        // Accedemos a la "base de datos" de ciudades que tenemos cargada en memoria
        const jsonData = CIUDADES_DATA;
        let foundCity = null;
        let foundCountry = null;

        // Recorremos toda la estructura de continentes y países hasta encontrar la ciudad correcta
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
            // Como no tenemos backend real, calculamos el precio y las valoraciones basándonos en el nombre para que siempre salga lo mismo
            let hash = 0;
            for (let i = 0; i < foundCity.name.length; i++) hash = foundCity.name.charCodeAt(i) + ((hash << 5) - hash);
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
                incluye: ["Vuelo ida y vuelta", "Alojamiento céntrico 4★", "Seguro de viaje básico", "Traslados aeropuerto"],
                imagenes: foundCity.carousel_images || [foundCity.image.url] // Usamos sus fotos o la principal si no tiene más
            };
        }
    } catch (e) {
        console.error("Error buscando datos del destino:", e);
    }

    // Si hemos encontrado datos, empezamos a rellenar la página
    if (data) {
        // Actualizamos título de la pestaña, nombre, país, descripción y precio
        document.title = `${data.nombre} - Viajes y Experiencias`;
        
        const titleEl = document.getElementById("page-title");
        if(titleEl) titleEl.textContent = data.nombre;
        
        const countryEl = document.getElementById("page-country");
        if(countryEl) countryEl.textContent = data.pais;
        
        const descEl = document.getElementById("page-description");
        if(descEl) descEl.textContent = data.descripcion;

        const priceEl = document.getElementById("page-price");
        if(priceEl) priceEl.textContent = `${data.precio}€`;

        // Pintamos las estrellitas y el número de reseñas
        const starsEl = document.getElementById("summary-stars");
        const scoreEl = document.getElementById("summary-score");
        const countEl = document.getElementById("summary-count");
        
        if (starsEl) {
            const ratingNum = Math.round(data.rating);
            starsEl.textContent = "★".repeat(ratingNum) + "☆".repeat(5 - ratingNum);
        }
        if (scoreEl) scoreEl.textContent = data.rating;
        if (countEl) countEl.textContent = `(${data.reviews} reseñas)`;

        // Generamos la lista de cosas que incluye el viaje
        const listaIncluye = document.getElementById("page-includes");
        if(listaIncluye && data.incluye) {
            listaIncluye.innerHTML = "";
            data.incluye.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                listaIncluye.appendChild(li);
            });
        }

        // Montamos el carrusel de fotos dinámicamente
        const carruselTrack = document.getElementById("dynamic-carrusel");
        if (carruselTrack) {
            carruselTrack.innerHTML = "";
            // Si solo tenemos una foto, la repetimos para que el carrusel no se rompa
            const imagenes = data.imagenes && data.imagenes.length > 0 ? data.imagenes : [data.imagen, data.imagen, data.imagen];
            
            imagenes.forEach(imgUrl => {
                const img = document.createElement("img");
                img.src = imgUrl;
                img.alt = data.nombre;
                carruselTrack.appendChild(img);
            });

            // Si el script del carrusel está cargado, lo inicializamos
            if (window.initCarrusel) {
                window.initCarrusel();
            }
        }
    }

    // Configuramos el botón de reservar para controlar si el usuario está logueado
    const btnReservar = document.getElementById('btn-reservar');
    if (btnReservar) {
        btnReservar.addEventListener('click', () => {
            // Comprobamos la sesión usando nuestro servicio
            if (typeof AuthService !== 'undefined' && !AuthService.checkSession()) {
                // Si no está logueado, guardamos dónde estaba para que vuelva aquí después
                sessionStorage.setItem("return_to", window.location.href);
                // Lo mandamos a la página de registro para que inicie sesión
                window.location.href = "signup.html?mode=login";
            } else {
                // Si todo está bien, nos vamos al formulario de compra
                window.location.href = `compra.html?destino=${createSlug(data.nombre)}`;
            }
        });
    }
});
