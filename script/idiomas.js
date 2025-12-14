// Sistema de cambio de idioma (ES/EN) con persistencia y soporte dinámico
// Utilidades para cookies
const CookieStorage = {
    set(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    },
    
    get(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }
};

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
            contact: "Contacto",
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
            search_placeholder: "Buscar destinos...",

            // FAQ
            faq_title: "Preguntas Frecuentes",
            faq_subtitle: "Encuentra respuestas a las dudas más comunes sobre nuestros servicios",
            faq_cat_bookings: "💳 Reservas y Pagos",
            faq_cat_travel: "✈️ Viajes y Destinos",
            faq_cat_account: "👤 Cuenta y Perfil",
            faq_cat_support: "📧 Soporte y Ayuda",
            faq_q1: "¿Cómo puedo hacer una reserva?",
            faq_a1: "Para hacer una reserva, simplemente navega por nuestros destinos destacados o experiencias recomendadas, selecciona el que más te guste y haz clic en \"Reservar ahora\". Deberás estar registrado para completar la reserva. El proceso es sencillo y te guiaremos paso a paso.",
            faq_q2: "¿Qué métodos de pago aceptan?",
            faq_a2: "Aceptamos las principales tarjetas de crédito y débito: Visa, Mastercard y American Express. Todos los pagos se procesan de forma segura a través de nuestro sistema encriptado.",
            faq_q3: "¿Puedo cancelar mi reserva?",
            faq_a3: "Sí, puedes cancelar tu reserva desde tu perfil en la sección \"Mis Reservas\". Las condiciones de cancelación varían según el destino y el momento de la cancelación. Generalmente, ofrecemos cancelación gratuita hasta 48 horas antes de la salida.",
            faq_q4: "¿Cuándo recibiré la confirmación de mi reserva?",
            faq_a4: "Recibirás un correo electrónico de confirmación inmediatamente después de completar tu reserva. Si no lo recibes en los próximos 10 minutos, revisa tu carpeta de spam o ponte en contacto con nosotros.",
            faq_q5: "¿Qué incluye el precio del viaje?",
            faq_a5: "Cada destino tiene diferentes inclusiones. Generalmente, nuestros paquetes incluyen vuelo ida y vuelta, alojamiento, desayunos y seguro de viaje básico. Los detalles específicos se muestran en la página de cada destino antes de realizar la reserva.",
            faq_q6: "¿Puedo viajar con mascotas?",
            faq_a6: "Sí, algunos de nuestros destinos aceptan mascotas. Durante el proceso de reserva podrás indicar si viajas con mascota y te informaremos sobre las políticas específicas, costes adicionales y requisitos de documentación necesarios.",
            faq_q7: "¿Necesito seguro de viaje?",
            faq_a7: "Todos nuestros paquetes incluyen un seguro de viaje básico. Sin embargo, recomendamos contratar una cobertura adicional si deseas mayor protección, especialmente para actividades de aventura o destinos remotos.",
            faq_q8: "¿Puedo añadir acompañantes después de hacer la reserva?",
            faq_a8: "Sí, puedes modificar tu reserva y añadir hasta 7 acompañantes (máximo 8 personas en total). Ponte en contacto con nuestro equipo de atención al cliente para gestionar los cambios. Ten en cuenta que pueden aplicarse cargos adicionales.",
            faq_q9: "¿Cómo creo una cuenta?",
            faq_a9: "Haz clic en \"Regístrate\" en la parte superior derecha de cualquier página. Solo necesitas proporcionar un nombre de usuario, correo electrónico y contraseña segura. Opcionalmente, puedes añadir una foto de perfil.",
            faq_q10: "¿Olvidé mi contraseña, qué hago?",
            faq_a10: "Por el momento, esta funcionalidad está en desarrollo. Si tienes problemas para acceder a tu cuenta, contacta con nuestro equipo de soporte a través del formulario de contacto y te ayudaremos a recuperar el acceso.",
            faq_q11: "¿Puedo cambiar mi información personal?",
            faq_a11: "Sí, puedes editar tu información personal en cualquier momento desde tu perfil. Ve a \"Mi Perfil\" y actualiza tus datos personales, teléfono, país y foto de perfil. Los cambios se guardan automáticamente.",
            faq_q12: "¿Cómo puedo contactar con atención al cliente?",
            faq_a12: "Puedes contactarnos a través de nuestro formulario de contacto, disponible en la sección \"Contacto\" del menú principal. Nuestro equipo responde generalmente en un plazo de 24-48 horas laborables.",
            faq_q13: "¿Tienen atención telefónica?",
            faq_a13: "Por el momento, ofrecemos atención principalmente a través de nuestro formulario de contacto y correo electrónico. Estamos trabajando en implementar un servicio de atención telefónica próximamente.",
            faq_q14: "¿Puedo dejar una reseña de mi experiencia?",
            faq_a14: "¡Por supuesto! Una vez que hayas realizado tu viaje, te animamos a dejar una reseña en la página del destino. Tu opinión ayuda a otros viajeros a tomar decisiones informadas. Puedes incluir texto y una calificación de 1 a 5 estrellas.",
            faq_cta_title: "¿No encuentras lo que buscas?",
            faq_cta_text: "Nuestro equipo está aquí para ayudarte con cualquier pregunta o duda",
            faq_cta_btn: "Contáctanos",

            // Contacto
            contact_title: "Contáctanos",
            contact_subtitle: "Estamos aquí para ayudarte con cualquier pregunta o consulta",
            contact_form_title: "Envíanos un mensaje",
            contact_success: "✓ Tu mensaje ha sido enviado correctamente. Te responderemos pronto.",
            contact_name_label: "Nombre completo *",
            contact_name_placeholder: "Tu nombre",
            contact_email_label: "Correo electrónico *",
            contact_email_placeholder: "tu@email.com",
            contact_subject_label: "Asunto *",
            contact_subject_default: "Selecciona un tema",
            contact_subject_booking: "Consulta sobre reserva",
            contact_subject_destination: "Información de destinos",
            contact_subject_payment: "Problemas con pagos",
            contact_subject_cancel: "Cancelación o modificación",
            contact_subject_account: "Problemas con mi cuenta",
            contact_subject_suggestion: "Sugerencias",
            contact_subject_other: "Otro",
            contact_message_label: "Mensaje *",
            contact_message_placeholder: "Cuéntanos en qué podemos ayudarte...",
            contact_submit: "Enviar mensaje",
            contact_info_email_title: "Email",
            contact_info_email_desc: "Respuesta en 24-48 horas",
            contact_info_chat_title: "Chat en vivo",
            contact_info_chat_hours: "Lunes a Viernes: 9:00 - 18:00",
            contact_info_chat_soon: "Próximamente disponible",
            contact_info_office_title: "Oficinas",
            contact_info_office_address: "Calle Ejemplo, 123<br>28001 Madrid, España",
            contact_info_hours_title: "Horario de atención",
            contact_info_hours_weekday: "Lunes a Viernes: 9:00 - 18:00",
            contact_info_hours_saturday: "Sábados: 10:00 - 14:00",
            contact_info_hours_sunday: "Domingos: Cerrado",
            contact_info_social_title: "Síguenos",

            // Experiencias (Contenido)
            exp_safari_title: "Safari fotográfico en Tanzania",
            exp_safari_desc: "Observa la gran migración y captura los momentos más increíbles de la fauna africana.",
            exp_angkor_title: "Templos antiguos de Angkor Wat",
            exp_angkor_desc: "Explora los majestuosos templos de Camboya al amanecer con guías expertos.",
            exp_tokio_title: "Tour gastronómico por Tokio",
            exp_tokio_desc: "Descubre la auténtica cocina japonesa en mercados locales y restaurantes tradicionales.",
            exp_machu_title: "Trekking al Machu Picchu",
            exp_machu_desc: "Camina por el famoso Camino Inca hasta la ciudadela perdida de los Incas.",
            exp_bali_title: "Retiro de yoga en Bali",
            exp_bali_desc: "Encuentra tu paz interior en un resort rodeado de arrozales y templos sagrados.",
            exp_islandia_title: "Auroras boreales en Islandia",
            exp_islandia_desc: "Observa las increíbles auroras boreales y explora cascadas, glaciares y géiseres.",
            exp_egipto_title: "Tour por las pirámides de Egipto",
            exp_egipto_desc: "Visita las pirámides de Giza, el Sphinx y navega por el Nilo en crucero.",
            exp_coral_title: "Buceo en la Gran Barrera de Coral",
            exp_coral_desc: "Sumérgete en el arrecife de coral más grande del mundo y descubre su biodiversidad.",
            exp_toscana_title: "Cata de vinos en La Toscana",
            exp_toscana_desc: "Recorre viñedos históricos y degusta los mejores vinos italianos.",
            exp_budapest_title: "Spa y termas en Budapest",
            exp_budapest_desc: "Relájate en las famosas termas históricas de la capital húngara.",
            exp_alpes_title: "Senderismo en los Alpes suizos",
            exp_alpes_desc: "Camina por los senderos más espectaculares de Europa con vistas impresionantes.",
            exp_sevilla_title: "Flamenco auténtico en Sevilla",
            exp_sevilla_desc: "Vive la pasión del flamenco en tablaos tradicionales y aprende sus secretos."
        },

        en: {
            // Header
            menu_destinos: "Top destinations",
            menu_experiencias: "Recommended experiences",
            login: "Login",
            signup: "Sign up",
            faq: "FAQ",
            help: "Contact",
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
            search_placeholder: "Search destinations...",

            // FAQ
            faq_title: "Frequently Asked Questions",
            faq_subtitle: "Find answers to the most common questions about our services",
            faq_cat_bookings: "💳 Bookings & Payments",
            faq_cat_travel: "✈️ Travel & Destinations",
            faq_cat_account: "👤 Account & Profile",
            faq_cat_support: "📧 Support & Help",
            faq_q1: "How can I make a booking?",
            faq_a1: "To make a booking, simply browse our featured destinations or recommended experiences, select the one you like best and click \"Book now\". You must be registered to complete the booking. The process is simple and we will guide you step by step.",
            faq_q2: "What payment methods do you accept?",
            faq_a2: "We accept major credit and debit cards: Visa, Mastercard and American Express. All payments are processed securely through our encrypted system.",
            faq_q3: "Can I cancel my booking?",
            faq_a3: "Yes, you can cancel your booking from your profile in the \"My Bookings\" section. Cancellation conditions vary depending on the destination and timing. Generally, we offer free cancellation up to 48 hours before departure.",
            faq_q4: "When will I receive my booking confirmation?",
            faq_a4: "You will receive an email confirmation immediately after completing your booking. If you don't receive it within 10 minutes, check your spam folder or contact us.",
            faq_q5: "What does the trip price include?",
            faq_a5: "Each destination has different inclusions. Generally, our packages include round-trip flights, accommodation, breakfasts and basic travel insurance. Specific details are shown on each destination page before booking.",
            faq_q6: "Can I travel with pets?",
            faq_a6: "Yes, some of our destinations accept pets. During the booking process you can indicate if you are traveling with a pet and we will inform you about specific policies, additional costs and necessary documentation requirements.",
            faq_q7: "Do I need travel insurance?",
            faq_a7: "All our packages include basic travel insurance. However, we recommend purchasing additional coverage if you want greater protection, especially for adventure activities or remote destinations.",
            faq_q8: "Can I add companions after making the booking?",
            faq_a8: "Yes, you can modify your booking and add up to 7 companions (maximum 8 people in total). Contact our customer service team to manage changes. Please note that additional charges may apply.",
            faq_q9: "How do I create an account?",
            faq_a9: "Click \"Sign up\" in the top right corner of any page. You only need to provide a username, email and secure password. Optionally, you can add a profile picture.",
            faq_q10: "I forgot my password, what do I do?",
            faq_a10: "At the moment, this functionality is under development. If you have problems accessing your account, contact our support team through the contact form and we will help you recover access.",
            faq_q11: "Can I change my personal information?",
            faq_a11: "Yes, you can edit your personal information at any time from your profile. Go to \"My Profile\" and update your personal data, phone, country and profile picture. Changes are saved automatically.",
            faq_q12: "How can I contact customer service?",
            faq_a12: "You can contact us through our contact form, available in the \"Contact\" section of the main menu. Our team usually responds within 24-48 business hours.",
            faq_q13: "Do you have phone support?",
            faq_a13: "At the moment, we offer support mainly through our contact form and email. We are working on implementing a telephone support service soon.",
            faq_q14: "Can I leave a review of my experience?",
            faq_a14: "Of course! Once you have completed your trip, we encourage you to leave a review on the destination page. Your opinion helps other travelers make informed decisions. You can include text and a rating from 1 to 5 stars.",
            faq_cta_title: "Can't find what you're looking for?",
            faq_cta_text: "Our team is here to help you with any questions or concerns",
            faq_cta_btn: "Contact us",

            // Contact
            contact_title: "Contact Us",
            contact_subtitle: "We're here to help with any questions or inquiries",
            contact_form_title: "Send us a message",
            contact_success: "✓ Your message has been sent successfully. We'll get back to you soon.",
            contact_name_label: "Full name *",
            contact_name_placeholder: "Your name",
            contact_email_label: "Email address *",
            contact_email_placeholder: "your@email.com",
            contact_subject_label: "Subject *",
            contact_subject_default: "Select a topic",
            contact_subject_booking: "Booking inquiry",
            contact_subject_destination: "Destination information",
            contact_subject_payment: "Payment issues",
            contact_subject_cancel: "Cancellation or modification",
            contact_subject_account: "Account problems",
            contact_subject_suggestion: "Suggestions",
            contact_subject_other: "Other",
            contact_message_label: "Message *",
            contact_message_placeholder: "Tell us how we can help...",
            contact_submit: "Send message",
            contact_info_email_title: "Email",
            contact_info_email_desc: "Response in 24-48 hours",
            contact_info_chat_title: "Live chat",
            contact_info_chat_hours: "Monday to Friday: 9:00 AM - 6:00 PM",
            contact_info_chat_soon: "Coming soon",
            contact_info_office_title: "Offices",
            contact_info_office_address: "Example Street, 123<br>28001 Madrid, Spain",
            contact_info_hours_title: "Business hours",
            contact_info_hours_weekday: "Monday to Friday: 9:00 AM - 6:00 PM",
            contact_info_hours_saturday: "Saturdays: 10:00 AM - 2:00 PM",
            contact_info_hours_sunday: "Sundays: Closed",
            contact_info_social_title: "Follow us",

            // Experiencias (Contenido)
            exp_safari_title: "Photographic Safari in Tanzania",
            exp_safari_desc: "Observe the great migration and capture the most incredible moments of the African fauna.",
            exp_angkor_title: "Ancient Temples of Angkor Wat",
            exp_angkor_desc: "Explore the majestic temples of Cambodia at sunrise with expert guides.",
            exp_tokio_title: "Gastronomic Tour in Tokyo",
            exp_tokio_desc: "Discover authentic Japanese cuisine in local markets and traditional restaurants.",
            exp_machu_title: "Trekking to Machu Picchu",
            exp_machu_desc: "Walk the famous Inca Trail to the lost citadel of the Incas.",
            exp_bali_title: "Yoga Retreat in Bali",
            exp_bali_desc: "Find your inner peace in a resort surrounded by rice fields and sacred temples.",
            exp_islandia_title: "Northern Lights in Iceland",
            exp_islandia_desc: "Observe the incredible northern lights and explore waterfalls, glaciers, and geysers.",
            exp_egipto_title: "Pyramids of Egypt Tour",
            exp_egipto_desc: "Visit the Giza pyramids, the Sphinx and sail the Nile on a cruise.",
            exp_coral_title: "Diving in the Great Barrier Reef",
            exp_coral_desc: "Dive into the world's largest coral reef and discover its biodiversity.",
            exp_toscana_title: "Wine Tasting in Tuscany",
            exp_toscana_desc: "Tour historic vineyards and taste the best Italian wines.",
            exp_budapest_title: "Spa and Thermal Baths in Budapest",
            exp_budapest_desc: "Relax in the famous historic thermal baths of the Hungarian capital.",
            exp_alpes_title: "Hiking in the Swiss Alps",
            exp_alpes_desc: "Walk through the most spectacular trails in Europe with impressive views.",
            exp_sevilla_title: "Authentic Flamenco in Seville",
            exp_sevilla_desc: "Experience the passion of flamenco in traditional tablaos and learn its secrets."
        }
    };

    function applyTranslations(lang) {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.placeholder = translations[lang][key];
                } else if (el.tagName === 'OPTION') {
                    el.textContent = translations[lang][key];
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        // Placeholders personalizados
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
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
            const continent = btn.getAttribute('data-continent');
            const type = btn.getAttribute('data-type');

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
                badge.textContent = translations[lang][key].toUpperCase();
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
        const currentLang = CookieStorage.get("site_lang") || "es";
        applyTranslations(currentLang);
    };

    let currentLang = CookieStorage.get("site_lang");
    if (!currentLang) {
        currentLang = "es";
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
                CookieStorage.set("site_lang", newLang);
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
