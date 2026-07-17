"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 text-white">
        <p className="text-xl font-bold">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 px-5 py-8 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/20 bg-blue-950/25 p-8 text-center shadow-2xl backdrop-blur-md">
        <p className="text-lg text-blue-100">
          Sesión iniciada correctamente
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Bienvenido a Atlas Master
        </h1>

        <p className="mt-5 break-all text-blue-100">
          {email}
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 min-h-12 w-full rounded-2xl border-2 border-white px-5 text-lg font-bold transition hover:bg-white/10"
        >
          CERRAR SESIÓN
        </button>
      </section>
    </main>
  );
}