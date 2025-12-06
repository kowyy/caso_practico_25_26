// Sistema de reseñas con límite de 3 y almacenamiento local

document.addEventListener("DOMContentLoaded", () => {

    // Detectar en qué página estamos
    const pageID = document.body.getAttribute("data-destino");

    if (!pageID) {
        console.error("No se encontró el atributo data-destino en <body>");
        return;
    }

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
        "petra": [
            { name: "Laura G.", text: "Una experiencia increíble. El amanecer en el Tesoro es inolvidable.", rating: 5 },
            { name: "Javier M.", text: "El guía fue excelente, pero hace bastante calor, id preparados.", rating: 4 }
        ],
        "las-vegas": [
            { name: "Marina P.", text: "El espectáculo del Cirque du Soleil fue increíble. Una experiencia única.", rating: 5 },
            { name: "Daniel R.", text: "Mucho ambiente, muchas luces, pero también mucho ruido. Aun así repetiría.", rating: 4 }
        ],
        "puerto-rico": [
            { name: "Sofía L.", text: "Agua cristalina y comida riquísima. Un paraíso total.", rating: 5 },
            { name: "Carlos F.", text: "Muy bonito, aunque algo húmedo. Ideal para desconectar.", rating: 4 }
        ]
    };

    // Cargar reseñas guardadas o usar las predeterminadas
    let reviews = JSON.parse(localStorage.getItem("reviews_" + pageID));

    if (!reviews) {
        reviews = defaultReviews[pageID] || [];
        localStorage.setItem("reviews_" + pageID, JSON.stringify(reviews));
    }

    // Renderizar las reseñas en el DOM
    function renderReviews() {
        reviewsContainer.innerHTML = "";

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
        localStorage.setItem("reviews_" + pageID, JSON.stringify(reviews));

        renderReviews();

        form.reset();
        
        alert("¡Gracias por tu reseña!");
    });
});
