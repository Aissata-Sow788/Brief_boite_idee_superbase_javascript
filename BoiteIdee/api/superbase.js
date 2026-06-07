import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
let taches = []
export async function chargerTaches() {
    try {
        const { data, error } = await supabaseClient
            .from("taches")
            .select("*");

        if (error) {
            console.error(error);
            return;
        }

        return data;
        } catch (err) {
            console.log("ChargerTaches", err)
        }
}

