import countriesJson from "../../data/atlas_master_countries.json";

export type FlagsContinentId =
  | "europa"
  | "america"
  | "asia"
  | "oceania"
  | "africa"
  | "mundo";

export type AtlasCountry = {
  name: string;
  iso2: string;
  iso3: string;
  continent: string;
  capital: string;
  population: number;
  area_km2: number;
  official_language: string;
  currency: string;
  landmarks: string[];
  hints: string[];
  flag_emoji: string;
  map_image_url: string | null;
  flag_image_url: string;
};

type AtlasCountriesFile = {
  meta: {
    total_countries: number;
    note: string;
    map_image_source: string;
    flag_image_source: string;
  };
  continents: string[];
  countries: AtlasCountry[];
};

export type FlagsQuestion = {
  correctCountry: AtlasCountry;
  options: string[];
};

const data = countriesJson as AtlasCountriesFile;
const allCountries = data.countries;

const labels: Record<FlagsContinentId, string> = {
  europa: "Europa",
  america: "América",
  asia: "Asia",
  oceania: "Oceanía",
  africa: "África",
  mundo: "Mundo",
};

export function isValidFlagsContinent(value: string): value is FlagsContinentId {
  return ["europa", "america", "asia", "oceania", "africa", "mundo"].includes(value);
}

export function getFlagsContinentLabel(continent: FlagsContinentId): string {
  return labels[continent];
}

export function getCountriesForFlagsContinent(
  continent: FlagsContinentId,
): AtlasCountry[] {
  switch (continent) {
    case "europa":
      return allCountries.filter((country) => country.continent === "Europa");

    case "asia":
      return allCountries.filter((country) => country.continent === "Asia");

    case "oceania":
      return allCountries.filter((country) => country.continent === "Oceania");

    case "africa":
      return allCountries.filter((country) => country.continent === "Africa");

    case "america":
      return allCountries.filter(
        (country) =>
          country.continent === "America del Norte" ||
          country.continent === "America del Sur",
      );

    case "mundo":
      return allCountries;
  }
}

function shuffleArray<T>(items: T[]): T[] {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

function sampleItems<T>(items: T[], count: number): T[] {
  return shuffleArray(items).slice(0, Math.min(count, items.length));
}

export function createFlagsGame(
  continent: FlagsContinentId,
  questionCount = 10,
): FlagsQuestion[] {
  const pool = getCountriesForFlagsContinent(continent);
  const selectedCountries = sampleItems(pool, questionCount);

  return selectedCountries.map((correctCountry) => {
    const distractors = sampleItems(
      pool.filter((country) => country.name !== correctCountry.name),
      3,
    ).map((country) => country.name);

    const options = shuffleArray([correctCountry.name, ...distractors]);

    return {
      correctCountry,
      options,
    };
  });
}