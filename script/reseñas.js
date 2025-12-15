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
    
    function initReviews(destinoId) {
        const reviewsContainer = document.getElementById("reviews");
        const form = document.getElementById("review-form");
        
        if (!reviewsContainer || !form) {
            return;
        }
        
        const username = SessionManager.getCurrentUser();
        const userLabel = document.getElementById('reviewing-as');
        const userDisplay = document.getElementById('reviewer-username');
        
        // Mostrar nombre del usuario si está logueado
        if (SessionManager.isLoggedIn() && username && userLabel) {
            userDisplay.textContent = username;
            userLabel.style.display = 'block';
        }
        
        let reviews = ReviewsManager.getDestinationReviews(destinoId);
        
        // Si no hay reseñas, crear las de ejemplo
        if (!reviews || reviews.length === 0) {
            reviews = [
                { 
                    name: "María González", 
                    text: "Un lugar increíble, totalmente recomendable. La experiencia superó mis expectativas.", 
                    rating: 5,
                    fecha: new Date().toLocaleDateString('es-ES'),
                    destino: destinoId
                },
                { 
                    name: "Carlos Ruiz", 
                    text: "Muy bonito, aunque un poco turístico. Aún así vale la pena visitarlo.", 
                    rating: 4,
                    fecha: new Date().toLocaleDateString('es-ES'),
                    destino: destinoId
                },
                { 
                    name: "Ana Martínez", 
                    text: "Perfecto para pasar unos días. Todo estuvo muy bien organizado.", 
                    rating: 5,
                    fecha: new Date().toLocaleDateString('es-ES'),
                    destino: destinoId
                }
            ];
            // Guardar las reseñas de ejemplo
            ReviewsManager.saveDestinationReviews(destinoId, reviews);
        }
        
        // Renderizar reseñas
        function renderReviews() {
            reviewsContainer.innerHTML = "";
            
            if (!reviews || reviews.length === 0) {
                reviewsContainer.innerHTML = "<p>No hay reseñas todavía. ¡Sé el primero en opinar!</p>";
                return;
            }
            
            // Mostrar reseñas (más recientes primero)
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
        
        // Manejar envío de reseña
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            if (!SessionManager.isLoggedIn()) {
                alert('Debes iniciar sesión para escribir una reseña');
                CookieAuth.set('return_url', window.location.href, 1);
                window.location.href = "signup.html?mode=login";
                return;
            }
            
            const activeUser = SessionManager.getCurrentUser();
            const textInput = document.getElementById("review-text");
            const ratingInput = document.getElementById("review-rating");
            
            if (!textInput.value.trim()) {
                alert('Por favor escribe tu opinión');
                return;
            }
            
            // Obtener datos del destino
            const destinoNombre = document.getElementById("page-title") 
                ? document.getElementById("page-title").textContent 
                : "Destino";
            
            const destinoPais = document.getElementById("page-country") 
                ? document.getElementById("page-country").textContent 
                : "";
            
            // Crear nueva reseña
            const newReview = {
                name: activeUser,
                text: textInput.value.trim(),
                rating: parseInt(ratingInput.value),
                fecha: new Date().toLocaleDateString('es-ES'),
                destino: destinoId,
                destinoNombre: destinoNombre,
                destinoPais: destinoPais
            };
            
            // Añadir a la lista actual
            reviews.push(newReview);
            
            // Guardar todas las reseñas actualizadas
            ReviewsManager.saveDestinationReviews(destinoId, reviews);
            
            // Renderizar
            renderReviews();
            
            // Limpiar formulario
            form.reset();
            
            alert('¡Reseña publicada correctamente!');
            
            // Scroll a la sección de reseñas
            reviewsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
});
