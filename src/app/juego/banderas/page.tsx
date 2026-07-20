"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const continents = [
  {
    id: "europa",
    initials: "EU",
    name: "Europa",
    description: "Reconoce las banderas de los países europeos.",
    multiplier: "Multiplicador 1.0x",
    locked: false,
  },
  {
    id: "america",
    initials: "AM",
    name: "América",
    description: "Norteamérica, Centroamérica, Caribe y Sudamérica.",
    multiplier: "Multiplicador 1.2x",
    locked: false,
  },
  {
    id: "asia",
    initials: "AS",
    name: "Asia",
    description: "Descubre las banderas del continente asiático.",
    multiplier: "Multiplicador 1.4x",
    locked: false,
  },
  {
    id: "oceania",
    initials: "OC",
    name: "Oceanía",
    description: "Reconoce las banderas de Oceanía y el Pacífico.",
    multiplier: "Multiplicador 1.6x",
    locked: false,
  },
  {
    id: "africa",
    initials: "AF",
    name: "África",
    description: "Pon a prueba tus conocimientos sobre África.",
    multiplier: "Multiplicador 1.6x",
    locked: false,
  },
  {
    id: "mundo",
    initials: "MU",
    name: "Mundo",
    description: "Banderas de todos los continentes mezcladas.",
    multiplier: "Completa antes los continentes",
    locked: true,
  },
];

export default function FlagsContinentPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setIsLoading(false);
    }

    void checkSession();
  }, [router]);

  function handleContinent(continentId: string, name: string, locked: boolean) {
    if (locked) {
      setMessage(
        "El modo Mundo se desbloqueará cuando completes Banderas en todos los continentes.",
      );
      return;
    }

    router.push(`/juego/banderas/${continentId}`);
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 text-white">
        <p className="text-xl font-bold">Cargando Banderas...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
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
                MODO DE JUEGO
              </p>

              <h1 className="text-2xl font-black sm:text-3xl">
                Banderas
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="min-h-11 rounded-xl border-2 border-white/90 px-5 font-bold transition hover:bg-white/10 active:scale-[0.98]"
          >
            VOLVER AL PANEL
          </button>
        </header>

        <section className="mt-6 rounded-3xl border border-white/20 bg-blue-950/20 p-6 text-center shadow-xl backdrop-blur-md sm:p-8">
          <p className="text-lg font-semibold text-blue-100">
            Elige una zona del mundo
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            ¿Qué continente quieres explorar?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100 sm:text-lg">
            Cada partida tendrá 10 países. El multiplicador aumenta según la
            dificultad del continente.
          </p>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {continents.map((continent) => (
            <button
              key={continent.id}
              type="button"
              onClick={() =>
                handleContinent(continent.id, continent.name, continent.locked)
              }
              className={`flex min-h-64 flex-col rounded-3xl border p-5 text-left shadow-lg transition active:scale-[0.99] ${
                continent.locked
                  ? "border-white/10 bg-slate-900/35 opacity-75"
                  : "border-white/20 bg-white/10 hover:-translate-y-1 hover:bg-white/15"
              }`}
            >
              <div className="flex w-full items-start justify-between gap-3">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-blue-950/30 text-xl font-black">
                  {continent.initials}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                    continent.locked
                      ? "bg-slate-800 text-slate-200"
                      : "bg-emerald-400 text-emerald-950"
                  }`}
                >
                  {continent.locked ? "BLOQUEADO" : "DISPONIBLE"}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-black">
                {continent.name}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-relaxed text-blue-100">
                {continent.description}
              </p>

              <p className="mt-5 text-sm font-bold text-white">
                {continent.multiplier}
              </p>
            </button>
          ))}
        </section>

        {message ? (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center font-bold text-emerald-800"
          >
            {message}
          </div>
        ) : null}

        <footer className="py-8 text-center text-sm text-blue-200">
          © 2026 Atlas Master
        </footer>
      </div>
    </main>
  );
}