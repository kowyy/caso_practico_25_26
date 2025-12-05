/* ============================================
   SISTEMA DE RESEÑAS CON LIMITE Y LOCALSTORAGE
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {

    // Identificar qué página es
    const pageID = document.body.getAttribute("data-destino");

    if (!pageID) {
        console.error("ERROR: falta data-destino en <body>");
        return;
    }

    const reviewsContainer = document.getElementById("reviews");
    const form = document.getElementById("review-form");
    const autoTextareas = document.querySelectorAll("textarea");

    autoTextareas.forEach(area => {
        area.addEventListener("input", () => {
            area.style.height = "auto";      // reinicia altura
            area.style.height = area.scrollHeight + "px"; // ajusta a contenido
        });
    });

    // Reseñas predeterminadas
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

    // Cargar reseñas desde localStorage
    let reviews = JSON.parse(localStorage.getItem("reviews_" + pageID));

    // Si no existen, cargar predeterminadas
    if (!reviews) {
        reviews = defaultReviews[pageID];
        localStorage.setItem("reviews_" + pageID, JSON.stringify(reviews));
    }

    // Función para mostrar reseñas
    function renderReviews() {
        reviewsContainer.innerHTML = "";

        reviews.forEach(r => {
            const div = document.createElement("div");
            div.className = "review-item";

            div.innerHTML = `
                <strong>${r.name}</strong>
                <p>${r.text}</p>
                <span>${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
            `;

            reviewsContainer.appendChild(div);
        });
    }

    // Pintamos reseñas
    renderReviews();


    // ======================================
    // AÑADIR NUEVA RESEÑA CON LIMITE DE 3
    // ======================================
    form.addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("review-name").value;
        const text = document.getElementById("review-text").value;
        const rating = parseInt(document.getElementById("review-rating").value);

        const newReview = { name, text, rating };

        // Si ya hay 3 reseñas → eliminar la más antigua (posición 0)
        if (reviews.length >= 3) {
            reviews.shift(); // elimina la más vieja
        }

        // Añadir la nueva
        reviews.push(newReview);

        // Guardar en localStorage
        localStorage.setItem("reviews_" + pageID, JSON.stringify(reviews));

        // Volver a pintar
        renderReviews();

        // Limpiar formulario
        form.reset();
    });
});
