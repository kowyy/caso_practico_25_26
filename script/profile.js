document.addEventListener("DOMContentLoaded", () => {
    
    // Verificar sesión
    const username = localStorage.getItem("site_username") || sessionStorage.getItem("site_username");
    // Recuperar avatar guardado (Base64)
    const savedAvatar = localStorage.getItem("site_user_avatar");
    
    if (!username) {
        window.location.href = "index.html";
        return;
    }

    const nameDisplay = document.getElementById("profile-name");
    const bioInput = document.getElementById("user-bio");
    const picDisplay = document.getElementById("profile-pic");
    const logoutBtn = document.getElementById("btn-logout");

    nameDisplay.textContent = username;
    
    // Si hay avatar guardado, usarlo. Si no, generar uno por defecto.
    if (savedAvatar) {
        picDisplay.src = savedAvatar;
    } else {
        picDisplay.src = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
    }

    // Cargar y guardar BIO (sin cambios respecto al anterior)
    const savedBio = localStorage.getItem("site_user_bio_" + username);
    if (savedBio) bioInput.value = savedBio;

    bioInput.addEventListener("input", () => {
        localStorage.setItem("site_user_bio_" + username, bioInput.value);
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("site_username");
        localStorage.removeItem("site_user_avatar"); // Limpiamos también el avatar
        sessionStorage.removeItem("site_username");
        window.location.href = "index.html";
    });
});
