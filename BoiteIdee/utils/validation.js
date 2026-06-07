export function setError(input, message) {
    input.classList.remove("success");
    input.classList.add("error"); // Cela permet souvent d'afficher une bordure rouge

    let error = input.nextElementSibling; // Récupère l'élément juste après le champ dans le HTML
    if (!error || !error.classList.contains("error-message")) {
        error = document.createElement("small");
        error.classList.add("error-message");
//Méthode JavaScript qui permet d'insérer un élément HTML à une position précise par rapport à un autre élément
        input.insertAdjacentElement("afterend", error);
    }
    error.textContent = message;
}

export function setSuccess(input) {
    input.classList.remove("error");
    input.classList.add("success");

    const error = input.nextElementSibling;
    if (error && error.classList.contains("error-message")) {
        error.remove();
    }
}
export function validateTitre() {
    const input = document.getElementById("titre");
    const titre = input.value.trim();

    if (!titre) {
        setError(input, "Veuillez remplir le titre");
        return false;
    }
    if (titre.length < 3) {
        setError(input, "Saisir au moins 3 caractères");
        return false;
    }

    setSuccess(input);
    return true;
}

export function validateCategorie() {
    const input = document.getElementById("categorie");

    if (!input.value) {
        setError(input, "Choisissez un domaine");
        return false;
    }

    setSuccess(input);
    return true;
}

export function validateDescription() {
    const input = document.getElementById("description");
    const valeur = input.value.trim();

    if (!valeur) {
        setError(input, "Veuillez remplir ce champ");
        return false;
    }
    if (valeur.length < 25 || valeur.length > 255) {
        setError(input, "Entre 25 et 255 caractères");
        return false;
    }

    setSuccess(input);
    return true;
}
