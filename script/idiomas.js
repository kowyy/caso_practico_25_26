document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------------------------
       ELEMENTOS DEL SELECTOR
    --------------------------------------------*/
    const langWrapper = document.querySelector(".lang-wrapper");
    const langToggle = document.getElementById("lang-toggle");
    const langMenu = document.getElementById("lang-menu");
    const langSelected = document.getElementById("lang-selected");

    /* -------------------------------------------
       DICCIONARIO DE TRADUCCIONES
    --------------------------------------------*/
    const translations = {
        es: {
            hero_title: "Bienvenido a tu próxima experiencia",
            hero_subtitle: "Explora el mundo con nosotros.",
            menu_destinos: "Destinos destacados",
            menu_experiencias: "Experiencias recomendadas",
            login: "Inicia sesión",
            signup: "Regístrate",
            faq: "FAQ",
            help: "Ayuda",
            best_title: "MEJORES DESTINOS",
            best_sub: "Los mejores destinos turísticos",
            see_more: "Ver más"
        },

        en: {
            hero_title: "Welcome to your next experience",
            hero_subtitle: "Explore the world with us.",
            menu_destinos: "Top destinations",
            menu_experiencias: "Recommended experiences",
            login: "Login",
            signup: "Sign up",
            faq: "FAQ",
            help: "Help",
            best_title: "TOP DESTINATIONS",
            best_sub: "The best travel spots",
            see_more: "See more"
        }
    };

    /* -------------------------------------------
       FUNCIÓN DE TRADUCCIÓN
    --------------------------------------------*/
    function applyTranslations(lang) {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    }

    /* -------------------------------------------
       DETECTAR IDIOMA DEL NAVEGADOR
    --------------------------------------------*/
    const userLang = navigator.language.toLowerCase().startsWith("en") ? "en" : "es";
    langSelected.textContent = userLang.toUpperCase();
    applyTranslations(userLang);

    /* -------------------------------------------
       ABRIR Y CERRAR MENÚ
    --------------------------------------------*/
    langToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        langMenu.style.display = langMenu.style.display === "block" ? "none" : "block";
        langWrapper.classList.toggle("rotate");
    });

    /* -------------------------------------------
       CAMBIAR IDIOMA MANUALMENTE
    --------------------------------------------*/
    langMenu.querySelectorAll("li").forEach(option => {
        option.addEventListener("click", (e) => {
            e.stopPropagation();

            const newLang = option.dataset.lang;
            langSelected.textContent = newLang.toUpperCase();

            // Aplicar traducción
            applyTranslations(newLang);

            langMenu.style.display = "none";
            langWrapper.classList.remove("rotate");
        });
    });

    /* -------------------------------------------
       CERRAR SI SE HACE CLIC FUERA
    --------------------------------------------*/
    document.addEventListener("click", () => {
        langMenu.style.display = "none";
        langWrapper.classList.remove("rotate");
    });
});
