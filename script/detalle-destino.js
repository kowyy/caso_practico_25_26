// Lógica para rellenar la plantilla de destino dinámicamente

document.addEventListener("DOMContentLoaded", async () => {
    
    // Obtener ID de la URL
    const params = new URLSearchParams(window.location.search);
    const destinoId = params.get('id');

    if (!destinoId) {
        window.location.href = "index.html";
        return;
    }

    // Slug helper
    function createSlug(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    // Helper para asegurar alta resolución si la URL es de Unsplash
    function ensureHighRes(url) {
        if (!url) return "";
        if (url.includes("images.unsplash.com")) {
             return url.replace("w=500", "w=1600").replace("q=60", "q=90");
        }
        return url;
    }

    try {
        const response = await fetch('ciudades-del-mundo.json');
        const data = await response.json();
        
        let destinoData = null;

        // Buscar el destino en el JSON aplanando al vuelo
        for (const cont of data.continents) {
            for (const pais of cont.countries) {
                const found = pais.cities.find(c => createSlug(c.name) === destinoId);
                if (found) {
                    destinoData = {
                        ...found,
                        pais: pais.name,
                        continente: cont.name
                    };
                    break;
                }
            }
            if (destinoData) break;
        }

        if (destinoData) {
            // Inyectar datos en el DOM
            document.title = `${destinoData.name} - Viajes y Experiencias`;
            document.body.setAttribute("data-destino", destinoId);
            
            document.getElementById("page-title").textContent = destinoData.name;
            document.getElementById("page-country").textContent = `${destinoData.pais}, ${destinoData.continente}`;
            document.getElementById("page-description").textContent = destinoData.description;

            const carruselTrack = document.getElementById("dynamic-carrusel");
            
            // Usamos el nuevo array 'carousel_images' si existe, si no, fallback a la imagen principal en array
            const imagesToLoad = destinoData.carousel_images || [destinoData.image.url];
            
            let imgsHTML = '';
            imagesToLoad.forEach((url, index) => {
                 const highResUrl = ensureHighRes(url);
                 imgsHTML += `<img src="${highResUrl}" alt="${destinoData.name} imagen ${index + 1}">`;
            });

            // Inyectamos el HTML de las imágenes
            carruselTrack.innerHTML = imgsHTML;

            if (window.initCarrusel) {
                setTimeout(() => window.initCarrusel(), 50);
            }

            let hash = 0;
            for (let i = 0; i < destinoData.name.length; i++) hash = destinoData.name.charCodeAt(i) + ((hash << 5) - hash);
            const precioBase = 500 + (Math.abs(hash) % 1500);
            
            document.getElementById("page-price").textContent = precioBase + "€";

            // Inclusiones genéricas
            const includes = [
                "Vuelo ida y vuelta",
                `Alojamiento en hotel céntrico (${Math.floor(Math.random() * 3) + 3} noches)`,
                "Seguro de viaje básico",
                `Visita guiada por ${destinoData.name}`
            ];
            
            const ulIncludes = document.getElementById("page-includes");
            ulIncludes.innerHTML = includes.map(i => `<li>${i}</li>`).join("");

            // Configurar botón de reserva
            document.getElementById("btn-reservar").onclick = () => {
                location.href = `compra.html?destino=${destinoId}`;
            };

        } else {
            document.querySelector(".destino-content").innerHTML = "<h2>Destino no encontrado</h2>";
        }

    } catch (error) {
        console.error("Error cargando detalles:", error);
    }
});
