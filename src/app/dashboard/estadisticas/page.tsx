"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PlayerStats = {
  total_points: number;
  correct_answers: number;
  games_played: number;
};

export default function PlayerStatsPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statsMessage, setStatsMessage] = useState("");

  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? "");

      const {
        data,
        error: statsError,
      } = await supabase
        .from("player_stats")
        .select(
          "total_points, correct_answers, games_played",
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (statsError) {
        console.error(
          "No se pudieron cargar las estadísticas:",
          statsError,
        );

        setStatsMessage(
          "No se han podido cargar las estadísticas del jugador.",
        );
      } else {
        const stats = data as PlayerStats | null;

        setGamesPlayed(stats?.games_played ?? 0);
        setTotalPoints(stats?.total_points ?? 0);
        setCorrectAnswers(stats?.correct_answers ?? 0);
      }

      setIsLoading(false);
    }

    void loadStats();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 text-white">
        <p className="text-xl font-bold">
          Cargando estadísticas...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
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

              <h1 className="text-2xl font-black sm:text-3xl">
                Panel del jugador
              </h1>

              <p className="mt-1 max-w-xs truncate text-sm text-blue-100 sm:max-w-md">
                {email}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="min-h-11 rounded-xl border-2 border-white/90 px-5 font-bold transition hover:bg-white/10 active:scale-[0.98]"
            >
              VOLVER AL PANEL
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="min-h-11 rounded-xl border-2 border-white/90 px-5 font-bold transition hover:bg-white/10 active:scale-[0.98]"
            >
              CERRAR SESIÓN
            </button>
          </div>
        </header>

        <section className="mt-6 rounded-3xl border border-white/20 bg-blue-950/20 p-6 text-center shadow-xl backdrop-blur-md sm:p-8">
          <p className="text-lg font-semibold text-blue-100">
            Tus estadísticas acumuladas
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            Tu progreso en Atlas Master
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100 sm:text-lg">
            Se contabilizan todas las partidas que hayas
            completado con tu cuenta.
          </p>
        </section>

        <section
          aria-label="Estadísticas acumuladas"
          className="mt-6 grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-center">
            <p className="text-4xl font-black sm:text-5xl">
              {gamesPlayed.toLocaleString("es-ES")}
            </p>

            <p className="mt-2 text-blue-100">
              Partidas completadas
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-center">
            <p className="text-4xl font-black sm:text-5xl">
              {totalPoints.toLocaleString("es-ES")}
            </p>

            <p className="mt-2 text-blue-100">
              Puntos acumulados
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-center">
            <p className="text-4xl font-black sm:text-5xl">
              {correctAnswers.toLocaleString("es-ES")}
            </p>

            <p className="mt-2 text-blue-100">
              Aciertos totales
            </p>
          </div>
        </section>

        {statsMessage ? (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center font-semibold text-amber-800"
          >
            {statsMessage}
          </div>
        ) : null}

        <section className="mt-6 rounded-3xl border border-white/20 bg-blue-950/20 p-6 text-center text-blue-100">
          <p>
            Las partidas abandonadas antes de finalizar no se
            añaden a estas estadísticas.
          </p>
        </section>

        <footer className="py-8 text-center text-sm text-blue-200">
          © 2026 Atlas Master
        </footer>
      </div>
    </main>
  );
}