// Sistema de cambio de idioma (ES/EN) con persistencia y soporte dinámico

document.addEventListener("DOMContentLoaded", () => {

    const langWrapper = document.querySelector(".lang-wrapper");
    const langToggle = document.getElementById("lang-toggle");
    const langMenu = document.getElementById("lang-menu");
    const langSelected = document.getElementById("lang-selected");

    // DICCIONARIO COMPLETO
    const translations = {
        es: {
            // Header
            menu_destinos: "Destinos destacados",
            menu_experiencias: "Experiencias recomendadas",
            login: "Inicia sesión",
            signup: "Regístrate",
            faq: "FAQ",
            help: "Ayuda",
            logout: "Cerrar sesión",
            
            // Home & Títulos
            hero_title: "Bienvenido a tu próxima experiencia",
            hero_subtitle: "Explora el mundo con nosotros.",
            carousel_title: "Destinos más populares",
            categories_title: "Encuentra tu estilo de viaje",
            best_title: "SELECCIÓN DEL MES",
            best_sub: "Nuestras recomendaciones para este mes",
            see_more_destinations: "Ver todos los destinos",
            
            // Filtros (Continentes y Tipos)
            filter_all: "Todos",
            filter_todas: "Todas",
            filter_europe: "Europa",
            filter_asia: "Asia",
            filter_north_america: "América del Norte",
            filter_south_america: "América del Sur",
            filter_africa: "África",
            filter_oceania: "Oceanía",
            
            // Filtros Experiencias
            filter_aventura: "Aventura",
            filter_cultura: "Cultura",
            filter_gastronomia: "Gastronomía",
            filter_relax: "Relax",
            filter_naturaleza: "Naturaleza",
            
            // Botones dinámicos
            btn_see_more: "Ver más", 
            btn_details: "Ver detalles",
            btn_reserve: "Reservar ahora",
            
            // Categorías Estáticas (Home)
            cat_beaches: "Playas paradisíacas",
            cat_beaches_sub: "Relájate en los mejores destinos costeros",
            cat_adventure: "Aventura extrema",
            cat_adventure_sub: "Vive experiencias llenas de adrenalina",
            cat_culture: "Cultura e historia",
            cat_culture_sub: "Descubre patrimonio y tradiciones",
            cat_food: "Gastronomía local",
            cat_food_sub: "Saborea los mejores platos del mundo",

            // Títulos de Páginas Específicas
            exp_hero_title: "Experiencias Recomendadas",
            exp_hero_sub: "Vive aventuras únicas y descubre lo mejor de cada destino",
            dest_hero_title: "Destinos Destacados",
            dest_hero_sub: "Descubre los lugares más increíbles del mundo seleccionados especialmente para ti",

            // Footer
            footer_contact: "Contacto",
            footer_profile: "Mi Perfil",
            footer_about: "Sobre nosotros",
            footer_blog: "Blog",
            footer_support: "Soporte",
            
            // Textos dinámicos
            reviews_count: "reseñas",
            search_placeholder: "Buscar destinos..."
        },

        en: {
            // Header
            menu_destinos: "Top destinations",
            menu_experiencias: "Recommended experiences",
            login: "Login",
            signup: "Sign up",
            faq: "FAQ",
            help: "Help",
            logout: "Log Out",
            
            // Home & Titles
            hero_title: "Welcome to your next experience",
            hero_subtitle: "Explore the world with us.",
            carousel_title: "Most popular destinations",
            categories_title: "Find your travel style",
            best_title: "MONTHLY SELECTION",
            best_sub: "Our top picks for this month",
            see_more_destinations: "See all destinations",
            
            // Filters
            filter_all: "All",
            filter_todas: "All",
            filter_europe: "Europe",
            filter_asia: "Asia",
            filter_north_america: "North America",
            filter_south_america: "South America",
            filter_africa: "Africa",
            filter_oceania: "Oceania",

            // Experience Filters
            filter_aventura: "Adventure",
            filter_cultura: "Culture",
            filter_gastronomia: "Gastronomy",
            filter_relax: "Relax",
            filter_naturaleza: "Nature",
            
            // Dynamic Buttons
            btn_see_more: "See more",
            btn_details: "See details",
            btn_reserve: "Book now",
            
            // Static Categories
            cat_beaches: "Paradise beaches",
            cat_beaches_sub: "Relax in the best coastal destinations",
            cat_adventure: "Extreme adventure",
            cat_adventure_sub: "Live adrenaline-filled experiences",
            cat_culture: "Culture and history",
            cat_culture_sub: "Discover heritage and traditions",
            cat_food: "Local gastronomy",
            cat_food_sub: "Savor the best dishes in the world",

            // Page Titles
            exp_hero_title: "Recommended Experiences",
            exp_hero_sub: "Live unique adventures and discover the best of each destination",
            dest_hero_title: "Top Destinations",
            dest_hero_sub: "Discover the most incredible places in the world selected especially for you",
            
            // Footer
            footer_contact: "Contact",
            footer_profile: "My Profile",
            footer_about: "About us",
            footer_blog: "Blog",
            footer_support: "Support",
            
            // Dynamic texts
            reviews_count: "reviews",
            search_placeholder: "Search destinations..."
        }
    };

    function applyTranslations(lang) {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        document.querySelectorAll('.ver-mas').forEach(btn => {
            if (btn.closest('.experiencia-card')) {
                btn.textContent = translations[lang]['btn_reserve'];
            } else if (btn.textContent.includes('detalles') || btn.textContent.includes('details')) {
                btn.textContent = translations[lang]['btn_details'];
            } else {
                btn.textContent = translations[lang]['btn_see_more'];
            }
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            let key = null;
            const continent = btn.getAttribute('data-continent'); // Para destinos
            const type = btn.getAttribute('data-type');           // Para experiencias

            if (continent) {
                if (continent === 'todos') key = 'filter_all';
                else key = 'filter_' + continent.toLowerCase().replace(/ /g, '_').replace(/é/g, 'e').replace(/á/g, 'a').replace(/í/g, 'i');
            } else if (type) {
                if (type === 'todas') key = 'filter_todas';
                else key = 'filter_' + type; 
            }

            if (key && translations[lang][key]) {
                btn.textContent = translations[lang][key];
            }
        });

        document.querySelectorAll('.exp-badge').forEach(badge => {
            const type = badge.textContent.toLowerCase();
            const key = 'filter_' + type;
            if (translations[lang][key]) {
                badge.textContent = translations[lang][key].toUpperCase(); // En mayúsculas
            }
        });

        document.querySelectorAll('.reviews').forEach(span => {
            const text = span.textContent;
            const match = text.match(/\((\d+)/); 
            if (match) {
                const number = match[1];
                span.textContent = `(${number} ${translations[lang]['reviews_count']})`;
            }
        });
    }

    window.updateDynamicTranslations = function() {
        const currentLang = localStorage.getItem("site_lang") || "es";
        applyTranslations(currentLang);
    };

    let currentLang = localStorage.getItem("site_lang");
    if (!currentLang) {
        currentLang = "es"; // Por defecto español
    }

    langSelected.textContent = currentLang.toUpperCase();
    applyTranslations(currentLang);

    if (langToggle) {
        langToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            langMenu.style.display = langMenu.style.display === "block" ? "none" : "block";
            langWrapper.classList.toggle("rotate");
        });
    }

    if (langMenu) {
        langMenu.querySelectorAll("li").forEach(option => {
            option.addEventListener("click", (e) => {
                e.stopPropagation();
                const newLang = option.dataset.lang;
                langSelected.textContent = newLang.toUpperCase();
                localStorage.setItem("site_lang", newLang);
                applyTranslations(newLang);
                langMenu.style.display = "none";
                langWrapper.classList.remove("rotate");
            });
        });
    }

    document.addEventListener("click", () => {
        if (langMenu) langMenu.style.display = "none";
        if (langWrapper) langWrapper.classList.remove("rotate");
    });
});
