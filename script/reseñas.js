// Sistema de reseñas con límite de 3 y almacenamiento local

document.addEventListener("DOMContentLoaded", () => {

    // Detectar en qué página estamos
    const pageID = document.body.getAttribute("data-destino");

    if (!pageID) {
        const checkInterval = setInterval(() => {
            const id = document.body.getAttribute("data-destino");
            if(id) {
                clearInterval(checkInterval);
                initReviews(id);
            }
        }, 100);
        return;
    }

    initReviews(pageID);

    function initReviews(id) {
        const reviewsContainer = document.getElementById("reviews");
        const form = document.getElementById("review-form");
        const autoTextareas = document.querySelectorAll("textarea");

        // Textareas que crecen con el contenido
        autoTextareas.forEach(area => {
            area.addEventListener("input", () => {
                area.style.height = "auto";
                area.style.height = area.scrollHeight + "px";
            });
        });

        // Reseñas por defecto para cada destino
        const defaultReviews = {
        };

        // Cargar reseñas guardadas o usar las predeterminadas, o vacío si es nuevo
        let reviews = JSON.parse(localStorage.getItem("reviews_" + id));

        if (!reviews) {
            reviews = defaultReviews[id] || []; // Si no hay default, array vacío
            localStorage.setItem("reviews_" + id, JSON.stringify(reviews));
        }

        // Renderizar las reseñas en el DOM
        function renderReviews() {
            if(!reviewsContainer) return;
            reviewsContainer.innerHTML = "";

            if (reviews.length === 0) {
                reviewsContainer.innerHTML = "<p><i>Sé el primero en escribir una reseña.</i></p>";
                return;
            }

            reviews.forEach(r => {
                const div = document.createElement("div");
                div.className = "review-item";

                const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

                div.innerHTML = `
                    <strong>${r.name}</strong>
                    <p>${r.text}</p>
                    <span>${stars}</span>
                `;

                reviewsContainer.appendChild(div);
            });
        }

        renderReviews();

        // Añadir nueva reseña
        if(form) {
            form.addEventListener("submit", e => {
                e.preventDefault();

                const name = document.getElementById("review-name").value;
                const text = document.getElementById("review-text").value;
                const rating = parseInt(document.getElementById("review-rating").value);

                const newReview = { name, text, rating };

                // Limitar a 3 reseñas, eliminar la más antigua si hay más
                if (reviews.length >= 3) {
                    reviews.shift();
                }

                reviews.push(newReview);

                // Guardar en localStorage
                localStorage.setItem("reviews_" + id, JSON.stringify(reviews));

                renderReviews();

                form.reset();
                
                alert("¡Gracias por tu reseña!");
            });
        }
    }
});
