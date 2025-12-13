const CookieAuth = {
    get(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    
    // Extracción del ID del destino desde la query string (ej: ?id=paris)
    const params = new URLSearchParams(window.location.search);
    const destinoId = params.get('id');

    if (!destinoId) {
        window.location.href = "index.html";
        return;
    }

    function createSlug(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    // Mejora de calidad de imagen para fuentes de Unsplash
    function ensureHighRes(url) {
        if (!url) return "";
        if (url.includes("images.unsplash.com")) {
             return url.replace("w=500", "w=1600").replace("q=60", "q=90");
        }
        return url;
    }

    try {
        const data = CIUDADES_DATA;
        
        let destinoData = null;

        // Búsqueda secuencial del destino en la estructura anidada de datos
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
            // Actualización del DOM con los datos encontrados
            document.title = `${destinoData.name} - Viajes y Experiencias`;
            document.body.setAttribute("data-destino", destinoId);
            
            document.getElementById("page-title").textContent = destinoData.name;
            document.getElementById("page-country").textContent = `${destinoData.pais}, ${destinoData.continente}`;
            document.getElementById("page-description").textContent = destinoData.description;

            const carruselTrack = document.getElementById("dynamic-carrusel");
            
            const imagesToLoad = destinoData.carousel_images || [destinoData.image.url];
            
            let imgsHTML = '';
            imagesToLoad.forEach((url, index) => {
                 const highResUrl = ensureHighRes(url);
                 imgsHTML += `<img src="${highResUrl}" alt="${destinoData.name} imagen ${index + 1}">`;
            });

            carruselTrack.innerHTML = imgsHTML;

            // Inicialización tardía del carrusel visual si existe script externo
            if (window.initCarrusel) {
                setTimeout(() => window.initCarrusel(), 50);
            }

            // Cálculo de precio determinista basado en caracteres ASCII para consistencia visual
            let hash = 0;
            for (let i = 0; i < destinoData.name.length; i++) hash = destinoData.name.charCodeAt(i) + ((hash << 5) - hash);
            const precioBase = 500 + (Math.abs(hash) % 1500);
            
            document.getElementById("page-price").textContent = precioBase + "€";

            const includes = [
                "Vuelo ida y vuelta",
                `Alojamiento en hotel céntrico (${Math.floor(Math.random() * 3) + 3} noches)`,
                "Seguro de viaje básico",
                `Visita guiada por ${destinoData.name}`
            ];
            
            const ulIncludes = document.getElementById("page-includes");
            ulIncludes.innerHTML = includes.map(i => `<li>${i}</li>`).join("");

            // Intercepción del botón de reserva para verificar autenticación
            document.getElementById("btn-reservar").onclick = () => {
                const username = CookieAuth.get('site_username');
                
                if (!username) {
                    mostrarModalLogin();
                } else {
                    location.href = `compra.html?destino=${destinoId}`;
                }
            };

            // Creación dinámica de modal de bloqueo si el usuario no está logueado
            function mostrarModalLogin() {
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
                overlay.style.display = 'flex';
                overlay.style.justifyContent = 'center';
                overlay.style.alignItems = 'center';
                overlay.style.zIndex = '10000';

                const modal = document.createElement('div');
                // Estilos inline para el modal generado dinámicamente
                modal.style.backgroundColor = 'white';
                modal.style.padding = '2.5rem';
                modal.style.borderRadius = '12px';
                modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                modal.style.textAlign = 'center';
                modal.style.minWidth = '350px';
                modal.style.maxWidth = '90%';

                modal.innerHTML = `
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#f2b01e" stroke-width="2" style="margin-bottom: 1rem;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.4rem;">Inicia sesión para continuar</h3>
                    <p style="color: #666; margin-bottom: 2rem;">Necesitas estar registrado para realizar reservas</p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button id="modal-login-btn" style="background: #000; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                            Iniciar sesión
                        </button>
                        <button id="modal-cancel-btn" style="background: #fff; color: #000; border: 1px solid #ccc; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                            Cancelar
                        </button>
                    </div>
                `;

                overlay.appendChild(modal);
                document.body.appendChild(overlay);

                document.getElementById('modal-login-btn').onclick = () => {
                    window.location.href = 'index.html#login';
                };

                document.getElementById('modal-cancel-btn').onclick = () => {
                    document.body.removeChild(overlay);
                };

                overlay.onclick = (e) => {
                    if (e.target === overlay) {
                        document.body.removeChild(overlay);
                    }
                };
            }

        } else {
            document.querySelector(".destino-content").innerHTML = "<h2>Destino no encontrado</h2>";
        }

    } catch (error) {
        console.error("Error cargando detalles:", error);
    }
});
