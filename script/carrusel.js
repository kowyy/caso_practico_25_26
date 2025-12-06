// Lógica del carrusel de imágenes
// Se envuelve en una función para poder inicializarlo dinámicamente

window.initCarrusel = function() {
    const track = document.getElementById('dynamic-carrusel');
    
    // Si no hay track o no tiene imágenes, no hacemos nada
    if (!track || track.children.length === 0) {
        console.log("Carrusel no inicializado: faltan elementos.");
        return;
    }

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carrusel-btn.next');
    const prevButton = document.querySelector('.carrusel-btn.prev');

    if (!nextButton || !prevButton) return;

    // Resetear estado si se recarga
    let currentSlideIndex = 0;

    const updateSlidePosition = () => {
        // Asumiendo que todas las imágenes tienen el mismo ancho que el contenedor
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + (slideWidth * currentSlideIndex) + 'px)';
    };

    // Asegurarse de que la posición es correcta al inicio y al redimensionar
    updateSlidePosition();
    window.addEventListener('resize', updateSlidePosition);

    // Event Listeners para los botones
    const newNextBtn = nextButton.cloneNode(true);
    nextButton.parentNode.replaceChild(newNextBtn, nextButton);
    
    const newPrevBtn = prevButton.cloneNode(true);
    prevButton.parentNode.replaceChild(newPrevBtn, prevButton);


    newNextBtn.addEventListener('click', () => {
        currentSlideIndex++;
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0; // Loop al principio
        }
        updateSlidePosition();
    });

    newPrevBtn.addEventListener('click', () => {
        currentSlideIndex--;
        if (currentSlideIndex < 0) {
            currentSlideIndex = slides.length - 1; // Loop al final
        }
        updateSlidePosition();
    });

    console.log("Carrusel inicializado correctamente con " + slides.length + " imágenes.");
};

// Intentar inicializar al cargar por si acaso (para contenido estático)
document.addEventListener('DOMContentLoaded', () => {
     if(document.getElementById('dynamic-carrusel').children.length > 0) {
         window.initCarrusel();
     }
});
