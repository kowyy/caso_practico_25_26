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
        // Crea reseñas falsas coherentes para cualquier ciudad nueva
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
            // Generar entre 2 y 4 reseñas aleatorias
            const numReviews = Math.floor(Math.random() * 3) + 2; 

            const cityName = cityId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            for (let i = 0; i < numReviews; i++) {
                const randomName = names[Math.floor(Math.random() * names.length)];
                const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
                // Interpolación simple
                const text = randomTemplate.replace("{City}", cityName);
                
                // Rating ponderado hacia arriba (para que se vea bonito)
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
            // Persistir inmediatamente para que el usuario las vea fijas en su sesión
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

                // Renderizado de estrellas
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
                    reviews.shift(); // Elimina la más antigua
                }
                reviews.push(newReview);

                localStorage.setItem("reviews_" + id, JSON.stringify(reviews));

                renderReviews();
                form.reset();
                alert("¡Gracias por tu reseña!");
            });
        }
    }
});
