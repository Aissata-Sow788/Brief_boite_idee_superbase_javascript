// INITIALISATION DES VARIABLES
let taches = [];
let indexModification = null;
let supabaseClient; // accessible partout


 // VALIDATION VISUELLE

function setError(input, message) {
    input.classList.remove("success");
    input.classList.add("error");

    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("error-message")) {
        error = document.createElement("small");
        error.classList.add("error-message");
        input.insertAdjacentElement("afterend", error);
    }
    error.textContent = message;
}

function setSuccess(input) {
    input.classList.remove("error");
    input.classList.add("success");

    const error = input.nextElementSibling;
    if (error && error.classList.contains("error-message")) {
        error.remove();
    }
}

function validateTitre() {
    const input = document.getElementById("titre");
    const titre = input.value.trim();

    if (!titre) return setError(input, "Veuillez remplir le titre"), false;
    if (titre.length < 3) return setError(input, "Saisir au moins 3 caractères"), false;

    setSuccess(input);
    return true;
}

function validateCategorie() {
    const input = document.getElementById("categorie");

    if (!input.value) return setError(input, "Choisissez un domaine"), false;

    setSuccess(input);
    return true;
}

function validateDescription() {
    const input = document.getElementById("description");
    const valeur = input.value.trim();

    if (!valeur) return setError(input, "Veuillez remplir ce champ"), false;
    if (valeur.length < 25 || valeur.length > 255) return setError(input, "Entre 25 et 255 caractères"), false;

    setSuccess(input);
    return true;
}


// IA

async function classerCategorie(titre, description) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer ",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-120b:free",
            messages: [{
                role: "user",
                content: `
                Tu es un classificateur STRICT.
                Choisis UNE SEULE catégorie parmi : pedagogie, evenement, campus, technique
                Règles : un seul mot, aucun texte, aucune ponctuation.
                Titre: ${titre}
                Description: ${description}
                `
            }]
        })
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return "technique";

    return content.toLowerCase().replace(/[^a-z]/g, "") || "technique";
}


 //SUPABASE

async function chargerTaches() {
    const { data, error } = await supabaseClient.from("taches").select("*");
    if (error) return console.error(error);

    taches = data;
    afficherToutesLesTaches();
}


// AFFICHAGE

function afficherTache(tache, index) {
    const liste = document.getElementById("liste_tache");

    let badgeClass = "blue";
    switch (tache.categorie) {
        case "evenement": badgeClass = "purple"; break;
        case "campus":    badgeClass = "green";  break;
        case "technique": badgeClass = "yellow"; break;
    }

    const card = document.createElement("li");
    card.innerHTML = `
        <div class="card">
            <span class="badge ${badgeClass}">${tache.categorie}</span>
            <div class="actions">
                <span class="edit"><ion-icon name="create-outline"></ion-icon></span>
                <span class="delete"><ion-icon name="trash-outline"></ion-icon></span>
            </div>
            <h3>${tache.titre}</h3>
            <p>${tache.description}</p>
            <div class="date">${tache.date}</div>
        </div>
    `;

    liste.appendChild(card);

        // Supprimer
        card.querySelector(".delete").addEventListener("click", async () => {
            const response = await supabaseClient
            .from('taches')
            .delete()
            .eq('id', tache.id)
            
            await chargerTaches();
            
        });
    // Modifier
    card.querySelector(".edit").addEventListener("click", async () => {
    document.getElementById("titre").value = tache.titre;
    document.getElementById("categorie").value = tache.categorie;
    document.getElementById("description").value = tache.description;

    const { error } = await supabaseClient
        .from('taches')
        .update({
            titre: tache.titre,
            categorie: tache.categorie,
            description: tache.description
        })
        .eq('id', tache.id);

    if (error) {
        console.log("Erreur Supabase :", error);
    }

    indexModification = index;
    document.getElementById("newtache").textContent = "Mettre à jour";
});
    
}

function afficherToutesLesTaches() {
    const liste = document.getElementById("liste_tache");
    liste.innerHTML = "";
    taches.forEach((tache, index) => afficherTache(tache, index));
}


 //FORMULAIRE

function resetFields() {
    ["titre", "categorie", "description"].forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove("success", "error");
        el.value = "";
        if (id === "categorie") el.selectedIndex = 0;
    });
}

const addtache = async () => {
    const btn = document.getElementById("newtache");

    if (!validateTitre() || !validateDescription() || !validateCategorie()) return;

    const titre = document.getElementById("titre").value.trim();
    const description = document.getElementById("description").value.trim();

    btn.textContent = "Analyse IA...";
    btn.disabled = true;

  
  try {
    const categorie = await classerCategorie(titre, description);
    let error;

    if (indexModification !== null) {
      const { error: updateError } = await supabaseClient
        .from("taches")
        .update({ titre, description, categorie })
        .eq("id", taches[indexModification].id);

      error = updateError;
      indexModification = null;

    } else {
      const { error: insertError } = await supabaseClient
        .from("taches")
        .insert([{ titre, categorie, description, date: new Date().toLocaleDateString("fr-FR") }]);

      error = insertError;
    }

    if (error) {
      console.error(error);
      alert("Erreur Supabase");
      return;
    }

    await chargerTaches();

    //  Reset champs + bordures après 1.5s
    setTimeout(resetFields, 1500);

    } catch (err) {
        console.error(err);
    } finally {
    //  Bouton toujours remis ici, peu importe le mode
    btn.textContent = "Ajouter";
    btn.disabled = false;
  }
};


 //INITIALISATION

document.addEventListener("DOMContentLoaded", () => {
supabaseClient = window.supabase.createClient(
    'https://ojoqqwfyitgtyqjgqgwq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qb3Fxd2Z5aXRndHlxamdxZ3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTY2ODAsImV4cCI6MjA5NjA3MjY4MH0.7fXBrTkPVFGcHHZH3Vh_-3PLWQLFVOOuZ78a2XmkYyc'
);

    document.getElementById("titre").addEventListener("input", validateTitre);
    document.getElementById("titre").addEventListener("blur", validateTitre);
    document.getElementById("categorie").addEventListener("change", validateCategorie);
    document.getElementById("description").addEventListener("input", validateDescription);
    document.getElementById("newtache").addEventListener("click", (e) => {
        e.preventDefault();
        addtache();
    });

    chargerTaches();
});