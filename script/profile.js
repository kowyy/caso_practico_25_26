document.addEventListener("DOMContentLoaded", () => {
    
    // Verificamos si hay sesión iniciada
    const username = localStorage.getItem("site_username") || sessionStorage.getItem("site_username");
    
    // Si no está logueado, lo mandamos fuera
    if (!username) {
        window.location.href = "signup.html";
        return;
    }

    // Referencias a los elementos
    const nameDisplay = document.getElementById("profile-name");
    const bioInput = document.getElementById("user-bio");
    const picDisplay = document.getElementById("profile-pic");
    const logoutBtn = document.getElementById("btn-logout");
    
    // Elementos para el cambio de imagen
    const changeAvatarBtn = document.getElementById("btn-change-avatar");
    const avatarInput = document.getElementById("avatar-upload");
    
    // Nuevos campos
    const fullnameInput = document.getElementById("user-fullname");
    const emailInput = document.getElementById("user-email");
    const phoneInput = document.getElementById("user-phone");
    const countrySelect = document.getElementById("user-country");

    // Ponemos el nombre del usuario
    nameDisplay.textContent = username;
    
    // Cargamos la foto guardada o ponemos una por defecto
    const savedAvatar = localStorage.getItem("site_user_avatar");
    if (savedAvatar) {
        picDisplay.src = savedAvatar;
    } else {
        picDisplay.src = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
    }

    // Manejo de la biografía
    const savedBio = localStorage.getItem("site_user_bio_" + username);
    if (savedBio) bioInput.value = savedBio;

    bioInput.addEventListener("input", () => {
        localStorage.setItem("site_user_bio_" + username, bioInput.value);
    });

    // Cargar y guardar información personal
    const savedFullname = localStorage.getItem("site_user_fullname_" + username);
    const savedEmail = localStorage.getItem("site_user_email_" + username);
    const savedPhone = localStorage.getItem("site_user_phone_" + username);
    const savedCountry = localStorage.getItem("site_user_country_" + username);

    if (savedFullname) fullnameInput.value = savedFullname;
    if (savedEmail) emailInput.value = savedEmail;
    if (savedPhone) phoneInput.value = savedPhone;
    if (savedCountry) countrySelect.value = savedCountry;

    // Auto-guardar campos
    fullnameInput.addEventListener("input", () => {
        localStorage.setItem("site_user_fullname_" + username, fullnameInput.value);
    });
    
    emailInput.addEventListener("input", () => {
        localStorage.setItem("site_user_email_" + username, emailInput.value);
    });
    
    phoneInput.addEventListener("input", () => {
        localStorage.setItem("site_user_phone_" + username, phoneInput.value);
    });
    
    countrySelect.addEventListener("change", () => {
        localStorage.setItem("site_user_country_" + username, countrySelect.value);
    });

    // Preferencias de viaje
    const prefCheckboxes = document.querySelectorAll('input[name="pref"]');
    const savedPrefs = JSON.parse(localStorage.getItem("site_user_prefs_" + username) || "[]");
    
    prefCheckboxes.forEach(checkbox => {
        if (savedPrefs.includes(checkbox.value)) {
            checkbox.checked = true;
        }
        
        checkbox.addEventListener("change", () => {
            const currentPrefs = Array.from(prefCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            localStorage.setItem("site_user_prefs_" + username, JSON.stringify(currentPrefs));
        });
    });

    // Lógica para cambiar la foto de perfil
    changeAvatarBtn.addEventListener("click", () => {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const newImageBase64 = event.target.result;
                
                // Actualizamos la imagen en la pantalla
                picDisplay.src = newImageBase64;
                
                // Guardamos en memoria para que persista
                try {
                    localStorage.setItem("site_user_avatar", newImageBase64);
                } catch (error) {
                    alert("La imagen es muy grande, intenta con una más pequeña.");
                }
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Cerrar sesión
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("site_username");
        localStorage.removeItem("site_user_avatar");
        sessionStorage.removeItem("site_username");
        window.location.href = "index.html";
    });
});
