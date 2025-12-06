// Sistema de búsqueda de destinos

document.addEventListener("DOMContentLoaded", () => {
    const searchContainer = document.querySelector(".search-container");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    const destinosGrid = document.querySelector(".destinos-grid");

    // Base de datos de destinos (fácil de expandir)
    const destinos = [
        {
            id: "petra",
            nombre: "Petra",
            pais: "Jordania",
            descripcion: "La ciudad rosa tallada en roca",
            tags: ["historia", "arqueología", "desierto", "cultura"],
            url: "petra.html",
            imagen: "images/petra.jpeg"
        },
        {
            id: "las-vegas",
            nombre: "Las Vegas",
            pais: "Estados Unidos",
            descripcion: "La ciudad del entretenimiento",
            tags: ["casinos", "espectáculos", "fiesta", "lujo"],
            url: "las-vegas.html",
            imagen: "images/vegas.jpeg"
        },
        {
            id: "puerto-rico",
            nombre: "Puerto Rico",
            pais: "Puerto Rico",
            descripcion: "Paraíso caribeño",
            tags: ["playa", "tropical", "caribe", "naturaleza"],
            url: "puerto-rico.html",
            imagen: "images/puerto-rico.jpeg"
        },
        {
            id: "paris",
            nombre: "París",
            pais: "Francia",
            descripcion: "Romance urbano: Sena, bulevares y museos icónicos",
            tags: ["europa", "romance", "museos", "torre eiffel"],
            url: "paris.html",
            imagen: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500"
        },
        {
            id: "kioto",
            nombre: "Kioto",
            pais: "Japón",
            descripcion: "Templos, santuarios y jardines clásicos",
            tags: ["asia", "templos", "cultura", "jardines"],
            url: "kioto.html",
            imagen: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500"
        },
        {
            id: "nueva-york",
            nombre: "Nueva York",
            pais: "Estados Unidos",
            descripcion: "Arquitectura icónica, parques y escena artística",
            tags: ["usa", "rascacielos", "urbano", "central park"],
            url: "nueva-york.html",
            imagen: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500"
        }
    ];

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
        const cards = destinosGrid.querySelectorAll(".destino-card");
        
        cards.forEach(card => {
            const titulo = card.querySelector(".destino-title").textContent.toLowerCase();
            const encontrado = resultados.some(r => 
                r.nombre.toLowerCase() === titulo
            );

            card.style.display = encontrado ? "flex" : "none";
        });

        // Mensaje si no hay resultados visibles
        const destinosVisibles = Array.from(cards).filter(
            card => card.style.display !== "none"
        );

        let noResultsMsg = document.getElementById("no-results-message");
        
        if (destinosVisibles.length === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement("div");
                noResultsMsg.id = "no-results-message";
                noResultsMsg.className = "no-results-grid";
                noResultsMsg.innerHTML = `
                    <p>No se encontraron destinos que coincidan con tu búsqueda.</p>
                `;
                destinosGrid.parentNode.insertBefore(noResultsMsg, destinosGrid.nextSibling);
            }
        } else {
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }
    }

    // Mostrar todos los destinos
    function mostrarTodosLosDestinos() {
        const cards = destinosGrid.querySelectorAll(".destino-card");
        cards.forEach(card => {
            card.style.display = "flex";
        });

        const noResultsMsg = document.getElementById("no-results-message");
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
});
