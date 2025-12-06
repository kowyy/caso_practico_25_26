// Carrusel de imágenes simple

const track = document.querySelector(".carrusel-track");
const slides = Array.from(track.children);
let index = 0;

// Mostrar la slide en el índice dado
function showSlide(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
}

// Botón anterior
document.querySelector(".carrusel-btn.prev").addEventListener("click", () => {
    showSlide(index - 1);
});

// Botón siguiente
document.querySelector(".carrusel-btn.next").addEventListener("click", () => {
    showSlide(index + 1);
});

// Auto-avance cada 5 segundos
setInterval(() => showSlide(index + 1), 5000);
