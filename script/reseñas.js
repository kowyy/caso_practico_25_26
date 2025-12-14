
document.addEventListener("DOMContentLoaded", () => {
    
    // Esperar a que el destino esté cargado
    const waitForDestinoID = () => {
        const pageID = document.body.getAttribute("data-destino");
        if (pageID) {
            initReviews(pageID);
        } else {
            setTimeout(waitForDestinoID, 100);
        }
    };

    waitForDestinoID();

    function initReviews(destinoId) {
        const reviewsContainer = document.getElementById("reviews");
        const form = document.getElementById("review-form");
        
        if (!reviewsContainer || !form) {
            console.error("No se encontraron elementos de reseñas");
            return;
        }
        
        const username = AuthService.getCurrentUser();
        const userLabel = document.getElementById('reviewing-as');
        const userDisplay = document.getElementById('reviewer-username');

        if (AuthService.checkSession() && username && userLabel) {
            userDisplay.textContent = username;
            userLabel.style.display = 'block';
        }

        // Cargar reseñas desde localStorage
        let reviews = JSON.parse(localStorage.getItem("reviews_" + destinoId) || "null");

        // Si no hay reseñas, crear algunas de ejemplo
        if (!reviews) {
            reviews = [
                { name: "María González", text: "Un lugar increíble, totalmente recomendable. La experiencia superó mis expectativas.", rating: 5 },
                { name: "Carlos Ruiz", text: "Muy bonito, aunque un poco turístico. Aún así vale la pena visitarlo.", rating: 4 },
                { name: "Ana Martínez", text: "Perfecto para pasar unos días. Todo estuvo muy bien organizado.", rating: 5 }
            ];
            localStorage.setItem("reviews_" + destinoId, JSON.stringify(reviews));
        }

        function renderReviews() {
            reviewsContainer.innerHTML = "";
            
            if (reviews.length === 0) {
                reviewsContainer.innerHTML = "<p>No hay reseñas todavía. ¡Sé el primero en opinar!</p>";
                return;
            }
            
            [...reviews].reverse().forEach(r => {
                const div = document.createElement("div");
                div.className = "review-item";
                const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
                div.innerHTML = `
                    <div>
                        <strong>${r.name}</strong> 
                        <span>${stars}</span>
                    </div>
                    <p>${r.text}</p>
                `;
                reviewsContainer.appendChild(div);
            });
        }

        renderReviews();

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!AuthService.checkSession()) {
                alert('Debes iniciar sesión para escribir una reseña');
                window.location.href = "signup.html?mode=login";
                return;
            }

            const activeUser = AuthService.getCurrentUser();
            const textInput = document.getElementById("review-text");
            const ratingInput = document.getElementById("review-rating");

            if (!textInput.value.trim()) {
                alert('Por favor escribe tu opinión');
                return;
            }

            const newReview = { 
                name: activeUser,
                text: textInput.value.trim(), 
                rating: parseInt(ratingInput.value),
                fecha: new Date().toLocaleDateString('es-ES'),
                destino: destinoId
            };
            
            // Guardar en las reseñas del destino
            reviews.push(newReview);
            localStorage.setItem("reviews_" + destinoId, JSON.stringify(reviews));

            // Guardar en el perfil del usuario
            const userReviewsKey = `user_reviews_${activeUser}`;
            const userReviews = JSON.parse(localStorage.getItem(userReviewsKey) || '[]');
            
            userReviews.push({
                ...newReview,
                destinoNombre: document.getElementById("page-title").textContent,
                destinoPais: document.getElementById("page-country").textContent
            });
            
            localStorage.setItem(userReviewsKey, JSON.stringify(userReviews));

            renderReviews(); 
            form.reset();
            
            alert('¡Reseña publicada correctamente!');
        });
    }
});

