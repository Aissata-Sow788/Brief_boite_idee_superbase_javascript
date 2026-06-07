const apiKey = import.meta.env.VITE_OPENROUTER_KEY;

export async function classerCategorie(titre, description) {

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
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
        } catch (err) {
        console.log("IA Openrouter", err)
    }
}
