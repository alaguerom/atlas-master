"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const gameModes = [
  {
    name: "Banderas",
    icon: "🏳️",
    description: "Reconoce el país por su bandera.",
    points: "100 puntos base",
    status: "Disponible",
  },
  {
    name: "Capitales",
    icon: "🏙️",
    description: "Relaciona cada capital con su país.",
    points: "130 puntos base",
    status: "Próximamente",
  },
  {
    name: "Siluetas",
    icon: "🗺️",
    description: "Identifica el país por su forma.",
    points: "140 puntos base",
    status: "Próximamente",
  },
  {
    name: "Monumentos",
    icon: "🏛️",
    description: "Descubre el país de cada monumento.",
    points: "110–150 puntos",
    status: "Próximamente",
  },
  {
    name: "Pistas",
    icon: "💡",
    description: "Adivina el país utilizando pistas.",
    points: "Según dificultad",
    status: "Próximamente",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? "");
      setIsLoading(false);
    }

    void loadUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  function handleModeClick(modeName: string) {
    if (modeName === "Banderas") {
      router.push("/juego/banderas");
      return;
    }

    setMessage(`${modeName} estará disponible próximamente.`);
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 text-white">
        <p className="text-xl font-bold">
          Cargando Atlas Master...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-blue-950/20 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-4">
            <Image
              src="/images/logo/atlas-master-logo.png"
              alt="Atlas Master"
              width={72}
              height={72}
              priority
              className="h-16 w-16 shrink-0 rounded-[22%] shadow-lg sm:h-[72px] sm:w-[72px]"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-100">
                ATLAS MASTER
              </p>

              <h1>
                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashboard/estadisticas")
                  }
                  aria-label="Abrir el Panel del jugador"
                  className="group flex items-center gap-2 text-left text-2xl font-black transition hover:text-emerald-200 sm:text-3xl"
                >
                  <span>Panel del jugador</span>

                  <span
                    aria-hidden="true"
                    className="transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
              </h1>

              <p className="mt-1 text-sm font-semibold text-emerald-200">
                Ver puntos, partidas y aciertos
              </p>

              <p className="mt-1 max-w-xs truncate text-sm text-blue-100 sm:max-w-md">
                {email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="min-h-11 rounded-xl border-2 border-white/90 px-5 font-bold transition hover:bg-white/10 active:scale-[0.98]"
          >
            CERRAR SESIÓN
          </button>
        </header>

        <section className="mt-6 rounded-3xl border border-white/20 bg-blue-950/20 p-6 text-center shadow-xl backdrop-blur-md sm:p-8">
          <p className="text-lg font-semibold text-blue-100">
            Bienvenido a tu aventura
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl lg:text-5xl">
            ¿Preparado para recorrer el mundo?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100 sm:text-lg">
            Elige un modo de juego, reconoce países y consigue
            puntos mientras completas tu atlas.
          </p>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-black sm:text-3xl">
              Modos de juego
            </h2>

            <p className="mt-1 text-blue-100">
              Elige el desafío con el que quieres comenzar.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gameModes.map((mode) => {
              const isAvailable = mode.name === "Banderas";

              return (
                <button
                  key={mode.name}
                  type="button"
                  onClick={() => handleModeClick(mode.name)}
                  className={`flex min-h-56 flex-col rounded-3xl border p-5 text-left shadow-lg transition hover:-translate-y-1 hover:bg-white/15 active:scale-[0.99] ${
                    isAvailable
                      ? "border-emerald-300 bg-emerald-500/20"
                      : "border-white/20 bg-white/10"
                  }`}
                >
                  <div className="flex w-full items-start justify-between gap-3">
                    <span className="text-5xl" aria-hidden="true">
                      {mode.icon}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                        isAvailable
                          ? "bg-emerald-400 text-emerald-950"
                          : "bg-blue-950/40 text-blue-100"
                      }`}
                    >
                      {mode.status}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-black">
                    {mode.name}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-blue-100">
                    {mode.description}
                  </p>

                  <p className="mt-4 text-sm font-bold text-white">
                    {mode.points}
                  </p>
                </button>
              );
            })}
          </div>
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