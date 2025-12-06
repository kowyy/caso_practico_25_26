document.addEventListener("DOMContentLoaded", () => {
    
    // Verificamos si hay sesión iniciada
    const username = localStorage.getItem("site_username") || sessionStorage.getItem("site_username");
    
    // Si no está logueado, lo mandamos fuera
    if (!username) {
        window.location.href = "index.html";
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

    // Lógica para cambiar la foto de perfil
    changeAvatarBtn.addEventListener("click", () => {
        avatarInput.click(); // Esto abre el selector de archivos nativo
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
