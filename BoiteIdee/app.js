import { chargerTaches, supabaseClient } from "./api/superbase.js";
import {classerCategorie} from "./api/openrouter.js"
import { setError, setSuccess, validateCategorie, validateDescription, validateTitre } from "./utils/validation.js";
import {createClient} from "@supabase/supabase-js"

// INITIALISATION DES VARIABLES
let taches = [];
let indexModification = null;



async function rafraichir() {
    taches = await chargerTaches();
    afficherToutesLesTaches(); //  appelé après chaque ajout/modif/suppression
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

    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    // Badge
    const badge = document.createElement("span");
    badge.className = `badge ${badgeClass}`;
    badge.textContent = tache.categorie;

    // Actions
    const actions = document.createElement("div");
    actions.className = "actions";

    const edit = document.createElement("span");
    edit.className = "edit";
    edit.innerHTML = `<ion-icon name="create-outline"></ion-icon>`;

    const deleteBtn = document.createElement("span");
    deleteBtn.className = "delete";
    deleteBtn.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`;

    actions.append(edit, deleteBtn);

    // Contenu
    const titre = document.createElement("h3");
    titre.textContent = tache.titre;

    const description = document.createElement("p");
    description.textContent = tache.description;

    const date = document.createElement("div");
    date.className = "date";
    date.textContent = tache.date;

    // Assemblage
    cardDiv.append(badge, actions, titre, description, date);
    card.appendChild(cardDiv);
    liste.appendChild(card);

    liste.appendChild(card);

        // Supprimer
    card.querySelector(".delete").addEventListener("click", async () => {
        const { error } = await supabaseClient
            .from('taches')
            .delete()
            .eq('id', tache.id);

        if (error) return console.error(error);

        await rafraichir(); // recharge et réaffiche
    });
    // Modifier
    card.querySelector(".edit").addEventListener("click", async () => {
    document.getElementById("titre").value = tache.titre;
    document.getElementById("categorie").value = tache.categorie;
    document.getElementById("description").value = tache.description;

    indexModification = index;
    document.getElementById("newtache").textContent = "Mettre à jour";
    console.log(tache)
   
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

    const titre = document.getElementById("titre").value.trim();
    const description = document.getElementById("description").value.trim();

    btn.textContent = "Analyse IA...";
    btn.disabled = true;

    try {
        const categorie = await classerCategorie(titre, description);

        const { error } = indexModification !== null
            ? await supabaseClient.from("taches").update({ titre, description, categorie }).eq("id", taches[indexModification].id)
            : await supabaseClient.from("taches").insert([{ titre, categorie, description, date: new Date().toLocaleDateString("fr-FR") }]);

        if (error) {
            console.error(error);
            alert("Erreur Supabase");
            return;
        }

        indexModification = null;
        await rafraichir(); // ✅ un seul appel ici
        setTimeout(resetFields, 1500);

    } catch (err) {
        console.error(err);
    } finally {
        btn.textContent = "Ajouter";
        btn.disabled = false;
    }
};

 //INITIALISATION

document.addEventListener("DOMContentLoaded", async () => {
    taches = await chargerTaches();
    afficherToutesLesTaches();
    document.getElementById("titre").addEventListener("input", validateTitre);
    document.getElementById("titre").addEventListener("blur", validateTitre);
    document.getElementById("categorie").addEventListener("change", validateCategorie);
    document.getElementById("description").addEventListener("input", validateDescription);

    document.getElementById("newtache").addEventListener("click", async (e) => {
    e.preventDefault();

    const titreValide = validateTitre();
    const categorieValide = validateCategorie();
    const descriptionValide = validateDescription();

    if (!titreValide) {
        setError(titreValide);
        return;
    }
        if (!categorieValide) {
        setError(categorieValide);
        return;
    }
        if (!descriptionValide) {
        setError(descriptionValide);
        return;
    }
    rafraichir();
    await addtache();
});

});