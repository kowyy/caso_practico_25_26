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
        
        const username = localStorage.getItem('site_username') || sessionStorage.getItem('site_username');
        const userLabel = document.getElementById('reviewing-as');
        const userDisplay = document.getElementById('reviewer-username');

        if (username && userLabel && userDisplay) {
            userDisplay.textContent = username;
            userLabel.style.display = 'block';
        }

        // Ajustar altura del textarea al escribir
        const autoTextareas = document.querySelectorAll("textarea");
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
                    textArea.value += btn.textContent;
                    textArea.focus();
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

        // Generar reseñas falsas para ciudades nuevas
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

        // Cargar reseñas guardadas
        let reviews = JSON.parse(localStorage.getItem("reviews_" + id));

        if (!reviews) {
            if (legacyReviews[id]) {
                reviews = legacyReviews[id];
            } else {
                reviews = generateMockReviews(id);
            }
            localStorage.setItem("reviews_" + id, JSON.stringify(reviews));
        }

        // Actualizar resumen en cabecera
        function updateHeaderSummary() {
            const summaryStars = document.getElementById("summary-stars");
            const summaryScore = document.getElementById("summary-score");
            const summaryCount = document.getElementById("summary-count");

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

                // Obtenemos el usuario activo en el momento del envío
                const activeUser = localStorage.getItem('site_username') || sessionStorage.getItem('site_username');
                
                if (!activeUser) {
                    alert('Debes iniciar sesión para escribir una reseña');
                    return;
                }

                const textInput = document.getElementById("review-text");
                const ratingInput = document.getElementById("review-rating");

                const newReview = { 
                    name: activeUser,
                    text: textInput.value, 
                    rating: parseInt(ratingInput.value),
                    fecha: new Date().toLocaleDateString('es-ES'),
                    destino: id
                };
                
                reviews.push(newReview);
                
                // Guardar en el navegador (Local)
                localStorage.setItem("reviews_" + id, JSON.stringify(reviews));

                // Guardar en el historial personal del usuario
                const userReviews = JSON.parse(localStorage.getItem(`user_reviews_${activeUser}`) || '[]');
                userReviews.push({
                    ...newReview,
                    destinoNombre: document.getElementById("page-title").textContent,
                    destinoPais: document.getElementById("page-country").textContent
                });
                localStorage.setItem(`user_reviews_${activeUser}`, JSON.stringify(userReviews));

                renderReviews(); 
                form.reset();
                
                // Mostrar alerta personalizada
                mostrarAlerta("¡Gracias por tu reseña!");
            });
        }
    }

    function mostrarAlerta(mensaje) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: '10000'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)', textAlign: 'center',
            minWidth: '300px', maxWidth: '90%'
        });

        modal.innerHTML = `
            <h3 style="margin-top:0; margin-bottom:1rem; color:#333;">WEBSITE</h3>
            <p style="font-size:1.1rem; margin-bottom:1.5rem;">${mensaje}</p>
        `;

        const btn = document.createElement('button');
        btn.textContent = 'Aceptar';
        Object.assign(btn.style, {
            backgroundColor: '#000', color: '#fff', border: 'none',
            padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600'
        });

        btn.onclick = () => document.body.removeChild(overlay);

        modal.appendChild(btn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
});
