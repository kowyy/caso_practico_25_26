document.addEventListener("DOMContentLoaded", () => {

    const waitForDestinoID = () => {
        const pageID = document.body.getAttribute("data-destino");
        if (pageID) initReviews(pageID);
        else setTimeout(waitForDestinoID, 100);
    };

    waitForDestinoID();

    function initReviews(id) {
        const reviewsContainer = document.getElementById("reviews");
        const form = document.getElementById("review-form");
        
        // Usamos el AuthService global definido en app.js
        const username = AuthService.getCurrentUser();
        const userLabel = document.getElementById('reviewing-as');
        const userDisplay = document.getElementById('reviewer-username');

        if (AuthService.checkSession() && username && userLabel) {
            userDisplay.textContent = username;
            userLabel.style.display = 'block';
        }

        // Carga de reseñas desde localStorage
        let reviews = JSON.parse(AuthService.getData("reviews_" + id) || "null");

        // Mock data si no hay reseñas
        if (!reviews) {
            reviews = [
                { name: "Usuario Ejemplo", text: "Un lugar fantástico.", rating: 5 },
                { name: "Viajero", text: "Muy recomendable.", rating: 4 }
            ];
            AuthService.saveData("reviews_" + id, JSON.stringify(reviews));
        }

        function renderReviews() {
            reviewsContainer.innerHTML = "";
            [...reviews].reverse().forEach(r => {
                const div = document.createElement("div");
                div.className = "review-item";
                const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
                div.innerHTML = `<div><strong>${r.name}</strong> <span>${stars}</span></div><p>${r.text}</p>`;
                reviewsContainer.appendChild(div);
            });
        }

        renderReviews();

        if (form) {
            form.addEventListener("submit", e => {
                e.preventDefault();

                if (!AuthService.checkSession()) {
                    alert('Debes iniciar sesión para escribir una reseña');
                    return;
                }

                const activeUser = AuthService.getCurrentUser();
                const textInput = document.getElementById("review-text");
                const ratingInput = document.getElementById("review-rating");

                const newReview = { 
                    name: activeUser,
                    text: textInput.value, 
                    rating: parseInt(ratingInput.value),
                    fecha: new Date().toLocaleDateString('es-ES'),
                    destino: id
                };
                
                // Guardar en destino
                reviews.push(newReview);
                AuthService.saveData("reviews_" + id, JSON.stringify(reviews));

                // Guardar en perfil de usuario (Historial)
                const userReviewsData = AuthService.getData(`user_reviews_${activeUser}`);
                const userReviews = userReviewsData ? JSON.parse(userReviewsData) : [];
                
                userReviews.push({
                    ...newReview,
                    destinoNombre: document.getElementById("page-title").textContent,
                    destinoPais: document.getElementById("page-country").textContent
                });
                AuthService.saveData(`user_reviews_${activeUser}`, JSON.stringify(userReviews));

                renderReviews(); 
                form.reset();
            });
        }
    }
});
