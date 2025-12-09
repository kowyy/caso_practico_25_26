// Sistema de búsqueda de destinos

document.addEventListener("DOMContentLoaded", async () => {
    const searchContainer = document.querySelector(".search-container");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    
    let destinosGrid = document.querySelector(".destinos-grid");

    if (destinosGrid && destinosGrid.id === "featured-grid") {
        console.log("Detectada página de Destacados: El buscador no modificará el grid.");
        destinosGrid = null; 
    }

    let destinos = [];
    
    // Función auxiliar para crear slugs (IDs)
    function createSlug(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    function getStars(value) {
        const rating = Math.round(value);
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }

    // Carga dinámica de datos
    try {
        const response = await fetch('ciudades-del-mundo.json');
        const data = await response.json();
        
        data.continents.forEach(cont => {
            cont.countries.forEach(pais => {
                pais.cities.forEach(ciudad => {
                    destinos.push({
                        id: createSlug(ciudad.name),
                        nombre: ciudad.name,
                        pais: pais.name,
                        descripcion: ciudad.description,
                        imagen: ciudad.image.url,
                        tags: [cont.name.toLowerCase(), pais.name.toLowerCase(), "turismo", "viaje"],
                        url: `destino-template.html?id=${createSlug(ciudad.name)}`
                    });
                });
            });
        });

    } catch (error) {
        console.error("Error cargando los destinos:", error);
        if(destinosGrid) {
            destinosGrid.innerHTML = "<p>Error cargando destinos. Por favor intenta más tarde.</p>";
        }
    }

    // Función para renderizar el grid
    function renderGrid(listaDestinos) {
        destinosGrid.innerHTML = "";
        listaDestinos.forEach(d => {
            const rating = (Math.random() * (5 - 3) + 3).toFixed(1); 
            const reviews = Math.floor(Math.random() * 500) + 50;
            
            const starsStr = getStars(rating);

            const article = document.createElement("article");
            article.className = "destino-card";
            article.setAttribute("data-destino", d.id);
            
            article.innerHTML = `
                <div class="thumb">
                    <img src="${d.imagen}" alt="${d.nombre}" loading="lazy">
                </div>
                <div class="card-body">
                    <h3 class="destino-title">${d.nombre}</h3>
                    <div class="meta-row">
                        <button class="ver-mas" onclick="location.href='${d.url}'">Ver más</button>
                        <div class="rating" aria-label="Calificación ${rating} de 5 (${reviews} reseñas)">
                            <span class="rating-value">${rating}</span>
                            <span class="stars" aria-hidden="true">${starsStr}</span>
                            <span class="reviews">(${reviews} reseñas)</span>
                        </div>
                    </div>
                </div>
            `;
            destinosGrid.appendChild(article);
        });
    }

    if (searchInput && searchResults) {
        // Búsqueda en tiempo real
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();

            // Si el input está vacío, ocultar resultados y mostrar todo
            if (query === "") {
                mostrarTodosLosDestinos();
                searchResults.innerHTML = "";
                searchResults.style.display = "none";
                return;
            }

            // Buscar coincidencias
            const resultados = destinos.filter(destino => {
                return (
                    destino.nombre.toLowerCase().includes(query) ||
                    destino.pais.toLowerCase().includes(query) ||
                    destino.descripcion.toLowerCase().includes(query) ||
                    destino.tags.some(tag => tag.toLowerCase().includes(query))
                );
            });

            // Mostrar resultados en el dropdown
            mostrarResultadosBusqueda(resultados, query);

            // Filtrar tarjetas visibles en el grid
            filtrarDestinosEnGrid(resultados);
        });

        // Mostrar dropdown al hacer focus
        searchInput.addEventListener("focus", () => {
            if (searchInput.value.trim() !== "") {
                searchResults.style.display = "block";
            }
        });

        // Cerrar al hacer clic fuera
        document.addEventListener("click", (e) => {
            if (!searchContainer.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = "none";
            }
        });
    }

    // Mostrar resultados en el dropdown
    function mostrarResultadosBusqueda(resultados, query) {
        searchResults.innerHTML = "";

        if (resultados.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>No se encontraron destinos para "${query}"</p>
                </div>
            `;
            searchResults.style.display = "block";
            return;
        }

        resultados.forEach(destino => {
            const item = document.createElement("div");
            item.className = "search-result-item";
            
            item.innerHTML = `
                <img src="${destino.imagen}" alt="${destino.nombre}">
                <div class="search-result-info">
                    <strong>${resaltarTexto(destino.nombre, query)}</strong>
                    <span>${destino.pais}</span>
                    <p>${destino.descripcion}</p>
                </div>
            `;

            item.addEventListener("click", () => {
                window.location.href = destino.url;
            });

            searchResults.appendChild(item);
        });

        searchResults.style.display = "block";
    }

    // Resaltar el texto que coincide
    function resaltarTexto(texto, query) {
        if (!query) return texto;
        const regex = new RegExp(`(${query})`, 'gi');
        return texto.replace(regex, '<mark>$1</mark>');
    }

    // Filtrar tarjetas en el grid
    function filtrarDestinosEnGrid(resultados) {
        if(destinosGrid) {
            renderGrid(resultados);
            
            if (resultados.length === 0) {
                const noResultsMsg = document.createElement("div");
                noResultsMsg.className = "no-results-grid";
                noResultsMsg.innerHTML = `<p>No se encontraron destinos que coincidan con tu búsqueda.</p>`;
                destinosGrid.appendChild(noResultsMsg);
            }
        }
    }

    // Mostrar todos los destinos
    function mostrarTodosLosDestinos() {
        if(destinosGrid) renderGrid(destinos);
    }
});
