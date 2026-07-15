// scripts/seed.ts
// Uso: npx tsx scripts/seed.ts
// Requiere las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
// (la service_role key, NUNCA la anon key, porque hay que saltar RLS para escribir)

import { createClient } from "@supabase/supabase-js";
import countriesData from "../data/atlas_master_countries.json";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CONTINENT_CODES: Record<string, { code: string; name_en: string }> = {
  "Africa": { code: "AF", name_en: "Africa" },
  "Asia": { code: "AS", name_en: "Asia" },
  "Europa": { code: "EU", name_en: "Europe" },
  "America del Norte": { code: "NA", name_en: "North America" },
  "America del Sur": { code: "SA", name_en: "South America" },
  "Oceania": { code: "OC", name_en: "Oceania" },
};

async function seed() {
  // 1. Continentes (a partir de countries[].continent, tomando la primera parte si hay "/")
  const continentNames = [
    ...new Set(countriesData.countries.map((c: any) => c.continent.split("/")[0])),
  ];

  const continentIdByName: Record<string, number> = {};

  for (const name of continentNames) {
    const meta = CONTINENT_CODES[name] ?? { code: name.slice(0, 2).toUpperCase(), name_en: name };
    const { data, error } = await supabase
      .from("continents")
      .upsert({ code: meta.code, name_es: name, name_en: meta.name_en }, { onConflict: "code" })
      .select("id")
      .single();
    if (error) throw error;
    continentIdByName[name] = data.id;
  }
  console.log(`Continentes insertados: ${continentNames.length}`);

  // 2. Paises
  for (const c of countriesData.countries as any[]) {
    const continentId = continentIdByName[c.continent.split("/")[0]];

    const { data: countryRow, error: countryError } = await supabase
      .from("countries")
      .upsert(
        {
          iso2: c.iso2,
          iso3: c.iso3,
          continent_id: continentId,
          name_es: c.name,
          capital: c.capital,
          population: c.population,
          area_km2: c.area_km2,
          official_language: c.official_language,
          currency: c.currency,
          flag_emoji: c.flag_emoji,
          flag_image_url: c.flag_image_url,
          map_image_url: c.map_image_url,
        },
        { onConflict: "iso2" }
      )
      .select("id")
      .single();

    if (countryError) {
      console.error(`Error en ${c.name}:`, countryError.message);
      continue;
    }

    // 3. Landmarks
    if (c.landmarks?.length) {
      await supabase.from("landmarks").insert(
        c.landmarks.map((name: string) => ({
          country_id: countryRow.id,
          name,
          is_primary: true,
        }))
      );
    }

    // 4. Pistas
    if (c.hints?.length) {
      await supabase.from("hints").insert(
        c.hints.map((text: string, i: number) => ({
          country_id: countryRow.id,
          text,
          order_index: i,
        }))
      );
    }
  }

  console.log(`Paises procesados: ${countriesData.countries.length}`);
}

seed()
  .then(() => {
    console.log("Seed completado.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error en el seed:", err);
    process.exit(1);
  });
