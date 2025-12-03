const track = document.querySelector(".carrusel-track");
const slides = Array.from(track.children);

let index = 0;

function showSlide(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
}

// Para retrodecer
document.querySelector(".carrusel-btn.prev").addEventListener("click", () => {
    showSlide(index - 1);
});

// Para avanzar
document.querySelector(".carrusel-btn.next").addEventListener("click", () => {
    showSlide(index + 1);
});

// Para que las imágenes vayan rotando
setInterval(() => showSlide(index + 1), 4500);
