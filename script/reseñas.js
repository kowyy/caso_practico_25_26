// Sistema de reseñas con persistencia local y generación procedural (Mocking)

document.addEventListener("DOMContentLoaded", () => {

    const waitForDestinoID = () => {
        const pageID = document.body.getAttribute("data-destino");
        if (pageID) {
            initReviews(pageID);
        } else {
            setTimeout(waitForDestinoID, 100);
        }
    };

    waitForDestinoID();

    function initReviews(id) {
        const reviewsContainer = document.getElementById("reviews");
        const form = document.getElementById("review-form");
        const autoTextareas = document.querySelectorAll("textarea");

        autoTextareas.forEach(area => {
            area.addEventListener("input", () => {
                area.style.height = "auto";
                area.style.height = area.scrollHeight + "px";
            });
        });

        const legacyReviews = {
            "petra": [
                { name: "Laura G.", text: "Una experiencia increíble. El amanecer en el Tesoro es inolvidable.", rating: 5 },
                { name: "Javier M.", text: "El guía fue excelente, pero hace bastante calor, id preparados.", rating: 4 }
            ],
            "las-vegas": [
                { name: "Marina P.", text: "El espectáculo del Cirque du Soleil fue increíble.", rating: 5 },
                { name: "Daniel R.", text: "Mucho ambiente y luces, aunque algo ruidoso para mi gusto.", rating: 4 }
            ]
        };

        // Generador Procedural (Mocking System)
        function generateMockReviews(cityId) {
            const names = ["Alex M.", "Sarah J.", "Carlos D.", "Yuki T.", "Emma W.", "Priya K.", "Lars U."];
            const templates = [
                "¡{City} superó mis expectativas! La comida fue increíble.",
                "Un destino precioso. Recomiendo visitar el centro histórico.",
                "El viaje estuvo bien organizado, aunque {City} estaba muy llena de gente.",
                "Volvería a {City} sin dudarlo. La gente es muy amable.",
                "Experiencia inolvidable. Los paisajes son tal cual las fotos."
            ];

            const mockReviews = [];
            const numReviews = Math.floor(Math.random() * 3) + 2; 

            const cityName = cityId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            for (let i = 0; i < numReviews; i++) {
                const randomName = names[Math.floor(Math.random() * names.length)];
                const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
                const text = randomTemplate.replace("{City}", cityName);
                const rating = Math.random() > 0.3 ? 5 : 4; 

                mockReviews.push({ name: randomName, text: text, rating: rating });
            }
            return mockReviews;
        }

        let reviews = JSON.parse(localStorage.getItem("reviews_" + id));

        if (!reviews) {
            if (legacyReviews[id]) {
                reviews = legacyReviews[id];
            } else {
                reviews = generateMockReviews(id);
            }
            localStorage.setItem("reviews_" + id, JSON.stringify(reviews));
        }

        function renderReviews() {
            if (!reviewsContainer) return;
            reviewsContainer.innerHTML = "";

            if (reviews.length === 0) {
                reviewsContainer.innerHTML = "<p><i>Sé el primero en escribir una reseña.</i></p>";
                return;
            }

            [...reviews].reverse().forEach(r => {
                const div = document.createElement("div");
                div.className = "review-item";

                const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${r.name}</strong>
                        <span style="color:var(--star-color)">${stars}</span>
                    </div>
                    <p>${r.text}</p>
                `;

                reviewsContainer.appendChild(div);
            });
        }

        renderReviews();

        if (form) {
            form.addEventListener("submit", e => {
                e.preventDefault();

                const nameInput = document.getElementById("review-name");
                const textInput = document.getElementById("review-text");
                const ratingInput = document.getElementById("review-rating");

                const newReview = { 
                    name: nameInput.value, 
                    text: textInput.value, 
                    rating: parseInt(ratingInput.value) 
                };

                if (reviews.length >= 5) {
                    reviews.shift(); 
                }
                reviews.push(newReview);

                localStorage.setItem("reviews_" + id, JSON.stringify(reviews));

                renderReviews();
                form.reset();
                
                // AQUÍ ESTÁ EL CAMBIO: Usamos nuestra función personalizada en lugar de alert()
                mostrarAlerta("¡Gracias por tu reseña!");
            });
        }
    }

    // --- FUNCIÓN PARA CREAR ALERTA PERSONALIZADA (SIN IP) ---
    function mostrarAlerta(mensaje) {
        // Crear el fondo oscuro
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
        overlay.style.zIndex = '10000'; // Muy alto para que quede encima de todo

        // Crear la cajita blanca
        const modal = document.createElement('div');
        modal.style.backgroundColor = 'white';
        modal.style.padding = '2rem';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        modal.style.textAlign = 'center';
        modal.style.minWidth = '300px';
        modal.style.maxWidth = '90%';

        // Título o Logo (Opcional, ponemos el nombre de la web)
        const titulo = document.createElement('h3');
        titulo.textContent = 'WEBSITE'; // O el nombre de vuestra web
        titulo.style.marginTop = '0';
        titulo.style.marginBottom = '1rem';
        titulo.style.color = '#333';

        // El mensaje
        const texto = document.createElement('p');
        texto.textContent = mensaje;
        texto.style.fontSize = '1.1rem';
        texto.style.marginBottom = '1.5rem';

        // El botón
        const btn = document.createElement('button');
        btn.textContent = 'Aceptar';
        // Estilos parecidos a vuestro btn-primary
        btn.style.backgroundColor = '#000'; 
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.padding = '10px 24px';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = '600';

        // Cerrar al hacer clic
        btn.onclick = () => {
            document.body.removeChild(overlay);
        };

        // Juntar todo
        modal.appendChild(titulo);
        modal.appendChild(texto);
        modal.appendChild(btn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
});