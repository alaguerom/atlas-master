"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  createFlagsGame,
  getCountriesForFlagsContinent,
  getFlagsContinentLabel,
  isValidFlagsContinent,
  type FlagsContinentId,
  type FlagsQuestion,
} from "@/lib/flagsGame";

type AnswerMode = "predictive" | "multiple-choice";
type AttemptNumber = 1 | 2 | 3;

/*
 * Buscador predictivo activado.
 *
 * El tipo test sigue programado y puede recuperarse
 * cambiando "predictive" por "multiple-choice".
 */
const ANSWER_MODE = "predictive" as AnswerMode;

const MAX_ATTEMPTS = 3;
const BASE_POINTS = 100;

const CONTINENT_MULTIPLIERS: Record<FlagsContinentId, number> = {
  europa: 1,
  america: 1.2,
  asia: 1.4,
  oceania: 1.6,
  africa: 1.6,
  mundo: 1.6,
};

const ATTEMPT_PERCENTAGES: Record<AttemptNumber, number> = {
  1: 1,
  2: 0.5,
  3: 0.2,
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es");
}

function countLetters(value: string): number {
  return Array.from(value).filter((character) =>
    /\p{L}/u.test(character),
  ).length;
}

function getFirstLetters(value: string, amount: number): string {
  return Array.from(value)
    .filter((character) => /\p{L}/u.test(character))
    .slice(0, amount)
    .join("")
    .toLocaleUpperCase("es");
}

function continentHasHelp(continent: FlagsContinentId): boolean {
  return (
    continent === "asia" ||
    continent === "africa" ||
    continent === "oceania"
  );
}

function getMaximumQuestionPoints(
  continent: FlagsContinentId,
): number {
  return Math.ceil(
    BASE_POINTS * CONTINENT_MULTIPLIERS[continent],
  );
}

function getAttemptPoints(
  continent: FlagsContinentId,
  attempt: AttemptNumber,
): number {
  return Math.ceil(
    getMaximumQuestionPoints(continent) *
      ATTEMPT_PERCENTAGES[attempt],
  );
}

function getAttemptPercentage(attempt: AttemptNumber): number {
  return Math.round(ATTEMPT_PERCENTAGES[attempt] * 100);
}

export default function FlagsGamePage() {
  const router = useRouter();
  const params = useParams();

  const continentParam = useMemo(() => {
    const raw = params.continent;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const isValidContinent =
    typeof continentParam === "string" &&
    isValidFlagsContinent(continentParam);

  const continent = isValidContinent
    ? (continentParam as FlagsContinentId)
    : null;

  const availableCountries = useMemo(() => {
    if (!continent) {
      return [];
    }

    return getCountriesForFlagsContinent(continent);
  }, [continent]);

  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<FlagsQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [attempt, setAttempt] = useState<AttemptNumber>(1);
  const [isResolved, setIsResolved] = useState(false);
  const [resolvedCorrectly, setResolvedCorrectly] =
    useState(false);

  const [selectedOption, setSelectedOption] =
    useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [searchText, setSearchText] = useState("");
  const [selectedCountryName, setSelectedCountryName] =
    useState<string | null>(null);
  const [searchMessage, setSearchMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    async function setupGame() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (!continent) {
        setIsLoading(false);
        return;
      }

      const newQuestions = createFlagsGame(continent, 10);

      setQuestions(newQuestions);
      setCurrentIndex(0);
      setAttempt(1);
      setIsResolved(false);
      setResolvedCorrectly(false);
      setSelectedOption(null);
      setScore(0);
      setCorrectAnswers(0);
      setFeedback("");
      setSearchText("");
      setSelectedCountryName(null);
      setSearchMessage("");
      setShowSuggestions(false);
      setIsLoading(false);
    }

    void setupGame();
  }, [continent, router]);

  const suggestions = useMemo(() => {
    if (
      !continent ||
      isResolved ||
      normalizeText(searchText).length === 0
    ) {
      return [];
    }

    const query = normalizeText(searchText);

    return availableCountries
      .filter((country) =>
        normalizeText(country.name).startsWith(query),
      )
      .sort((countryA, countryB) =>
        countryA.name.localeCompare(countryB.name, "es"),
      )
      .slice(0, 8);
  }, [
    availableCountries,
    continent,
    isResolved,
    searchText,
  ]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 text-white">
        <p className="text-xl font-bold">
          Preparando partida...
        </p>
      </main>
    );
  }

  if (!continent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 px-4 text-white">
        <section className="w-full max-w-xl rounded-3xl border border-white/20 bg-blue-950/20 p-8 text-center shadow-xl backdrop-blur-md">
          <h1 className="text-3xl font-black">
            Continente no válido
          </h1>

          <p className="mt-4 text-blue-100">
            No se ha podido iniciar la partida de Banderas.
          </p>

          <Link
            href="/juego/banderas"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-500 px-6 font-extrabold text-white transition hover:bg-emerald-600"
          >
            VOLVER A CONTINENTES
          </Link>
        </section>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 px-4 text-white">
        <section className="w-full max-w-xl rounded-3xl border border-white/20 bg-blue-950/20 p-8 text-center">
          <h1 className="text-3xl font-black">
            No hay preguntas disponibles
          </h1>

          <button
            type="button"
            onClick={() => router.push("/juego/banderas")}
            className="mt-6 min-h-12 rounded-2xl bg-emerald-500 px-6 font-extrabold"
          >
            VOLVER
          </button>
        </section>
      </main>
    );
  }

  const finished = currentIndex >= questions.length;
  const currentQuestion = questions[currentIndex];

  function submitAnswer(explicitCountryName?: string) {
    if (
      isResolved ||
      finished ||
      !currentQuestion ||
      !continent
    ) {
      return;
    }

    const exactCountry = availableCountries.find(
      (country) =>
        normalizeText(country.name) === normalizeText(searchText),
    );

    const answerName =
      explicitCountryName ??
      selectedCountryName ??
      exactCountry?.name;

    if (!answerName) {
      setSearchMessage(
        "Selecciona uno de los países que aparecen en el buscador.",
      );
      setShowSuggestions(true);
      return;
    }

    setSelectedOption(answerName);
    setSearchMessage("");
    setShowSuggestions(false);

    const isCorrect =
      normalizeText(answerName) ===
      normalizeText(currentQuestion.correctCountry.name);

    if (isCorrect) {
      const obtainedPoints = getAttemptPoints(
        continent,
        attempt,
      );

      setScore((previous) => previous + obtainedPoints);
      setCorrectAnswers((previous) => previous + 1);
      setIsResolved(true);
      setResolvedCorrectly(true);
      setFeedback(
        `¡Correcto! Has conseguido ${obtainedPoints} puntos.`,
      );
      return;
    }

    if (attempt < MAX_ATTEMPTS) {
      const nextAttempt = (attempt + 1) as AttemptNumber;

      setAttempt(nextAttempt);
      setSearchText("");
      setSelectedCountryName(null);
      setSelectedOption(null);
      setFeedback(
        `No es correcto. Inténtalo de nuevo. Este es tu intento ${nextAttempt} de ${MAX_ATTEMPTS}.`,
      );
      return;
    }

    setIsResolved(true);
    setResolvedCorrectly(false);
    setSearchText("");
    setSelectedCountryName(null);
    setFeedback(
      `No es correcto. La respuesta era ${currentQuestion.correctCountry.name}.`,
    );
  }

  function handleSearchChange(value: string) {
    setSearchText(value);
    setSelectedCountryName(null);
    setSearchMessage("");
    setShowSuggestions(true);
  }

  function handleSuggestion(countryName: string) {
    setSearchText(countryName);
    setSelectedCountryName(countryName);
    setSearchMessage("");
    setShowSuggestions(false);
  }

  function handleSearchKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (selectedCountryName) {
        submitAnswer(selectedCountryName);
        return;
      }

      const exactCountry = availableCountries.find(
        (country) =>
          normalizeText(country.name) ===
          normalizeText(searchText),
      );

      if (exactCountry) {
        submitAnswer(exactCountry.name);
        return;
      }

      if (suggestions.length > 0) {
        submitAnswer(suggestions[0].name);
      }
    }

    if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  function handleDontKnow() {
    if (isResolved || finished || !currentQuestion) {
      return;
    }

    setIsResolved(true);
    setResolvedCorrectly(false);
    setSelectedOption(null);
    setSearchText("");
    setSelectedCountryName(null);
    setSearchMessage("");
    setShowSuggestions(false);
    setFeedback(
      `La respuesta era ${currentQuestion.correctCountry.name}. Esta pregunta vale 0 puntos.`,
    );
  }

  function handleNext() {
    setCurrentIndex((previous) => previous + 1);
    setAttempt(1);
    setIsResolved(false);
    setResolvedCorrectly(false);
    setSelectedOption(null);
    setFeedback("");
    setSearchText("");
    setSelectedCountryName(null);
    setSearchMessage("");
    setShowSuggestions(false);
  }

  function restartGame() {
    if (!continent) {
      return;
    }

    const newQuestions = createFlagsGame(continent, 10);

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setAttempt(1);
    setIsResolved(false);
    setResolvedCorrectly(false);
    setSelectedOption(null);
    setScore(0);
    setCorrectAnswers(0);
    setFeedback("");
    setSearchText("");
    setSelectedCountryName(null);
    setSearchMessage("");
    setShowSuggestions(false);
  }

  function getOptionClass(option: string) {
    const baseClass =
      "min-h-14 w-full rounded-2xl border-2 px-4 py-3 text-left text-base font-bold transition";

    if (!isResolved) {
      return `${baseClass} border-white/20 bg-white/10 hover:bg-white/15 active:scale-[0.99]`;
    }

    const isCorrect =
      option === currentQuestion.correctCountry.name;
    const isSelected = option === selectedOption;

    if (isCorrect) {
      return `${baseClass} border-emerald-300 bg-emerald-500/25`;
    }

    if (isSelected) {
      return `${baseClass} border-red-300 bg-red-500/25`;
    }

    return `${baseClass} border-white/10 bg-white/5 text-blue-100 opacity-80`;
  }

  if (finished) {
    const maximumGamePoints =
      getMaximumQuestionPoints(continent) *
      questions.length;

    const scorePercentage = Math.round(
      (score / maximumGamePoints) * 100,
    );

    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 px-4 py-5 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <section className="rounded-3xl border border-white/20 bg-blue-950/20 p-8 text-center shadow-xl backdrop-blur-md">
            <Image
              src="/images/logo/atlas-master-logo.png"
              alt="Atlas Master"
              width={96}
              height={96}
              priority
              className="mx-auto h-24 w-24 rounded-[22%] shadow-lg"
            />

            <p className="mt-5 text-lg font-semibold text-blue-100">
              Resultado final ·{" "}
              {getFlagsContinentLabel(continent)}
            </p>

            <h1 className="mt-2 text-4xl font-black sm:text-5xl">
              {score} puntos
            </h1>

            <p className="mt-3 text-xl text-blue-100">
              {correctAnswers} de {questions.length} banderas
              acertadas
            </p>

            <p className="mt-2 text-blue-100">
              Has conseguido el {scorePercentage}% de los{" "}
              {maximumGamePoints} puntos posibles.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  router.push("/juego/banderas")
                }
                className="min-h-14 rounded-2xl border-2 border-white/90 px-6 text-lg font-bold transition hover:bg-white/10"
              >
                CAMBIAR CONTINENTE
              </button>

              <button
                type="button"
                onClick={restartGame}
                className="min-h-14 rounded-2xl bg-emerald-500 px-6 text-lg font-extrabold shadow-lg transition hover:bg-emerald-600"
              >
                JUGAR OTRA VEZ
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const maximumQuestionPoints =
    getMaximumQuestionPoints(continent);

  const currentAttemptPoints = getAttemptPoints(
    continent,
    attempt,
  );

  const showHelp = continentHasHelp(continent);
  const countryName = currentQuestion.correctCountry.name;
  const letterCount = countLetters(countryName);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-blue-950/20 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo/atlas-master-logo.png"
              alt="Atlas Master"
              width={72}
              height={72}
              priority
              className="h-16 w-16 rounded-[22%] shadow-lg sm:h-[72px] sm:w-[72px]"
            />

            <div>
              <p className="text-sm font-semibold text-blue-100">
                MODO BANDERAS
              </p>

              <h1 className="text-2xl font-black sm:text-3xl">
                {getFlagsContinentLabel(continent)}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/juego/banderas")}
            className="min-h-11 rounded-xl border-2 border-white/90 px-5 font-bold transition hover:bg-white/10 active:scale-[0.98]"
          >
            VOLVER
          </button>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-sm text-blue-100">Pregunta</p>
            <p className="mt-1 text-2xl font-black sm:text-3xl">
              {currentIndex + 1}/{questions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-sm text-blue-100">Intento</p>
            <p className="mt-1 text-2xl font-black sm:text-3xl">
              {attempt}/{MAX_ATTEMPTS}
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-sm text-blue-100">
              Puntos acumulados
            </p>
            <p className="mt-1 text-2xl font-black sm:text-3xl">
              {score}
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-sm text-blue-100">
              Valor del intento
            </p>
            <p className="mt-1 text-2xl font-black sm:text-3xl">
              {getAttemptPercentage(attempt)}%
            </p>
            <p className="mt-1 text-xs text-blue-100">
              {currentAttemptPoints} de {maximumQuestionPoints} puntos
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/20 bg-blue-950/20 p-6 shadow-xl backdrop-blur-md sm:p-8">
          <p className="text-center text-lg font-semibold text-blue-100">
            ¿De qué país es esta bandera?
          </p>

          <div className="mt-6 flex justify-center">
            <img
              src={currentQuestion.correctCountry.flag_image_url}
              alt="Bandera para identificar"
              className="max-h-72 w-full max-w-md rounded-2xl border-4 border-white bg-white object-contain shadow-2xl"
            />
          </div>

          {showHelp && !isResolved ? (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center">
              <p className="font-bold">
                Número de letras: {letterCount}
              </p>

              {attempt === 2 ? (
                <p className="mt-2 text-blue-100">
                  Primera letra:{" "}
                  <strong className="text-white">
                    {getFirstLetters(countryName, 1)}
                  </strong>
                </p>
              ) : null}

              {attempt === 3 ? (
                <p className="mt-2 text-blue-100">
                  Empieza por:{" "}
                  <strong className="text-white">
                    {getFirstLetters(countryName, 2)}
                  </strong>
                </p>
              ) : null}
            </div>
          ) : null}

          {ANSWER_MODE === "predictive" ? (
            <div className="mx-auto mt-8 max-w-xl">
              <label
                htmlFor="country-search"
                className="mb-2 block text-sm font-bold text-blue-50"
              >
                Escribe el nombre del país
              </label>

              <div className="relative">
                <input
                  id="country-search"
                  type="text"
                  autoComplete="off"
                  value={searchText}
                  disabled={isResolved}
                  onChange={(event) =>
                    handleSearchChange(event.target.value)
                  }
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Empieza a escribir..."
                  className="min-h-14 w-full rounded-2xl border-2 border-white/30 bg-white px-5 text-lg font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-white focus:ring-4 focus:ring-blue-200/40 disabled:opacity-90"
                />

                {showSuggestions &&
                suggestions.length > 0 ? (
                  <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl">
                    {suggestions.map((country) => (
                      <button
                        key={country.iso2}
                        type="button"
                        onClick={() =>
                          handleSuggestion(country.name)
                        }
                        className="flex min-h-12 w-full items-center justify-between rounded-xl px-4 py-2 text-left font-semibold transition hover:bg-blue-50"
                      >
                        <span>{country.name}</span>

                        <span
                          aria-hidden="true"
                          className="text-xl"
                        >
                          {country.flag_emoji}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {searchMessage ? (
                <p
                  role="alert"
                  className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
                >
                  {searchMessage}
                </p>
              ) : null}

              {!isResolved ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => submitAnswer()}
                    className="min-h-14 rounded-2xl bg-emerald-500 px-6 text-lg font-extrabold shadow-lg transition hover:bg-emerald-600 active:scale-[0.99]"
                  >
                    COMPROBAR RESPUESTA
                  </button>

                  <button
                    type="button"
                    onClick={handleDontKnow}
                    className="min-h-14 rounded-2xl border-2 border-white/90 px-6 text-lg font-bold transition hover:bg-white/10 active:scale-[0.99]"
                  >
                    NO LO SÉ
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            /*
             * Tipo test conservado como sistema de reserva.
             * Permanece oculto mientras ANSWER_MODE sea
             * "predictive".
             */
            <div className="mt-8">
              <div className="grid gap-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => submitAnswer(option)}
                    disabled={isResolved}
                    className={getOptionClass(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {!isResolved ? (
                <button
                  type="button"
                  onClick={handleDontKnow}
                  className="mt-4 min-h-14 w-full rounded-2xl border-2 border-white/90 px-6 text-lg font-bold transition hover:bg-white/10"
                >
                  NO LO SÉ
                </button>
              ) : null}
            </div>
          )}

          {feedback && !isResolved ? (
            <p
              role="status"
              className="mx-auto mt-5 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center font-bold text-amber-800"
            >
              {feedback}
            </p>
          ) : null}

          {isResolved ? (
            <div
              className={`mt-6 rounded-2xl border px-5 py-4 text-center ${
                resolvedCorrectly
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              <p className="text-lg font-bold">{feedback}</p>

              <button
                type="button"
                onClick={handleNext}
                className="mt-4 min-h-12 rounded-2xl bg-emerald-500 px-6 text-lg font-extrabold text-white shadow-lg transition hover:bg-emerald-600"
              >
                {currentIndex === questions.length - 1
                  ? "VER RESULTADO"
                  : "SIGUIENTE"}
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}