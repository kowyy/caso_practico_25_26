// Logica de las reseñas y puntuaciones

document.addEventListener("DOMContentLoaded", () => {

    // Esperamos a que cargue el ID del destino
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

        // Elementos de la cabecera para actualizar la nota
        const summaryStars = document.getElementById("summary-stars");
        const summaryScore = document.getElementById("summary-score");
        const summaryCount = document.getElementById("summary-count");

        // Ajustar altura del textarea al escribir
        autoTextareas.forEach(area => {
            area.addEventListener("input", () => {
                area.style.height = "auto";
                area.style.height = area.scrollHeight + "px";
            });
        });

        const emojiBtns = document.querySelectorAll('.emoji-btn');
        const textArea = document.getElementById('review-text');
        
        if(emojiBtns && textArea) {
            emojiBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Añadir el emoji al texto existente
                    textArea.value += btn.textContent;
                    textArea.focus(); // Volver a poner el foco en la caja
                });
            });
        }

        // Reseñas de ejemplo fijas
        const legacyReviews = {
            "petra": [
                { name: "Laura G.", text: "Una experiencia increíble. El amanecer en el Tesoro es inolvidable. 📸", rating: 5 },
                { name: "Javier M.", text: "El guía fue excelente, pero hace bastante calor, id preparados. ☀️", rating: 4 }
            ],
            "las-vegas": [
                { name: "Marina P.", text: "El espectáculo del Cirque du Soleil fue increíble.", rating: 5 },
                { name: "Daniel R.", text: "Mucho ambiente y luces, aunque algo ruidoso para mi gusto.", rating: 4 }
            ]
        };

        // Generar reseñas falsas (Mocking) para ciudades nuevas
        function generateMockReviews(cityId) {
            const names = ["Alex M.", "Sarah J.", "Carlos D.", "Yuki T.", "Emma W.", "Priya K.", "Lars U."];
            const templates = [
                "¡{City} superó mis expectativas! La comida fue increíble. 🍝",
                "Un destino precioso. Recomiendo visitar el centro histórico. 🏛️",
                "El viaje estuvo bien organizado, aunque {City} estaba muy llena de gente.",
                "Volvería a {City} sin dudarlo. La gente es muy amable. 😊",
                "Experiencia inolvidable. Los paisajes son tal cual las fotos. 🏔️"
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

        // Cargar reseñas guardadas (Persistencia)
        let reviews = JSON.parse(localStorage.getItem("reviews_" + id));

        if (!reviews) {
            if (legacyReviews[id]) {
                reviews = legacyReviews[id];
            } else {
                reviews = generateMockReviews(id);
            }
            localStorage.setItem("reviews_" + id, JSON.stringify(reviews));
        }

        // Función matemática para calcular la media real
        function updateHeaderSummary() {
            if (!summaryStars || reviews.length === 0) return;

            const totalScore = reviews.reduce((sum, r) => sum + r.rating, 0);
            const average = (totalScore / reviews.length).toFixed(1);
            const roundedAverage = Math.round(average);
            const starsStr = "★".repeat(roundedAverage) + "☆".repeat(5 - roundedAverage);

            summaryStars.textContent = starsStr;
            summaryScore.textContent = average;
            summaryCount.textContent = `(${reviews.length} opiniones)`;
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

            updateHeaderSummary();
        }

        renderReviews();

        // Enviar nueva reseña
        if (form) {
            form.addEventListener("submit", e => {
                e.preventDefault();

                const username = localStorage.getItem('site_username') || sessionStorage.getItem('site_username');
                
                if (!username) {
                    alert('Debes iniciar sesión para escribir una reseña');
                    return;
                }

                const nameInput = document.getElementById("review-name");
                const textInput = document.getElementById("review-text");
                const ratingInput = document.getElementById("review-rating");

                const newReview = { 
                    name: nameInput.value, 
                    text: textInput.value, 
                    rating: parseInt(ratingInput.value),
                    fecha: new Date().toLocaleDateString('es-ES'),
                    destino: id
                };
                
                reviews.push(newReview);
                
                // Guardamos en el navegador
                localStorage.setItem("reviews_" + id, JSON.stringify(reviews));

                // Guardar en el historial del usuario
                const userReviews = JSON.parse(localStorage.getItem(`user_reviews_${username}`) || '[]');
                userReviews.push({
                    ...newReview,
                    destinoNombre: document.getElementById("page-title").textContent,
                    destinoPais: document.getElementById("page-country").textContent
                });
                localStorage.setItem(`user_reviews_${username}`, JSON.stringify(userReviews));

                renderReviews(); 
                form.reset();
                
                mostrarAlerta("¡Gracias por tu reseña!");
            });
        }
    }

    // Modal personalizado
    function mostrarAlerta(mensaje) {
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
        modal.style.backgroundColor = 'white';
        modal.style.padding = '2rem';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        modal.style.textAlign = 'center';
        modal.style.minWidth = '300px';
        modal.style.maxWidth = '90%';

        const titulo = document.createElement('h3');
        titulo.textContent = 'WEBSITE'; 
        titulo.style.marginTop = '0';
        titulo.style.marginBottom = '1rem';
        titulo.style.color = '#333';

        const texto = document.createElement('p');
        texto.textContent = mensaje;
        texto.style.fontSize = '1.1rem';
        texto.style.marginBottom = '1.5rem';

        const btn = document.createElement('button');
        btn.textContent = 'Aceptar';
        btn.style.backgroundColor = '#000'; 
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.padding = '10px 24px';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = '600';

        btn.onclick = () => {
            document.body.removeChild(overlay);
        };

        modal.appendChild(titulo);
        modal.appendChild(texto);
        modal.appendChild(btn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
});
