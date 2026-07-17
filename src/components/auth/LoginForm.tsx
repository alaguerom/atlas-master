"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setErrorMessage(
          "No se pudo iniciar sesión. Comprueba el correo y la contraseña.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage(
        "Se ha producido un error. Inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block text-sm font-bold text-blue-50"
        >
          Correo electrónico
        </label>

        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="jugador@ejemplo.com"
          className="min-h-12 w-full rounded-xl border border-white/30 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-white focus:ring-4 focus:ring-blue-200/40"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-2 block text-sm font-bold text-blue-50"
        >
          Contraseña
        </label>

        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Introduce tu contraseña"
          className="min-h-12 w-full rounded-xl border border-white/30 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-white focus:ring-4 focus:ring-blue-200/40"
        />
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 text-lg font-extrabold shadow-lg transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
      >
        {isLoading ? "ENTRANDO..." : "INICIAR SESIÓN"}
      </button>

      <p className="text-center text-sm text-blue-100">
        ¿Todavía no tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-bold text-white underline underline-offset-4 hover:text-blue-100"
        >
          Registrarse
        </Link>
      </p>

      <Link
        href="/"
        className="block text-center text-sm font-semibold text-blue-100 hover:text-white"
      >
        &larr; Volver al inicio
      </Link>
    </form>
  );
}