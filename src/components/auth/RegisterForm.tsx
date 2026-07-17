"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Introduce tu correo electronico.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "La contrase\u00f1a debe tener al menos 8 caracteres.",
      );
      return;
    }

    if (password !== repeatPassword) {
      setErrorMessage("Las contrase\u00f1as no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(
        "Registro realizado. Revisa tu correo y pulsa el enlace de confirmacion.",
      );

      setPassword("");
      setRepeatPassword("");
    } catch {
      setErrorMessage(
        "No se pudo completar el registro. Intentalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="register-email"
          className="mb-2 block text-sm font-bold text-blue-50"
        >
          Correo electr&oacute;nico
        </label>

        <input
          id="register-email"
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
          htmlFor="register-password"
          className="mb-2 block text-sm font-bold text-blue-50"
        >
          Contrase&ntilde;a
        </label>

        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="M&iacute;nimo 8 caracteres"
          className="min-h-12 w-full rounded-xl border border-white/30 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-white focus:ring-4 focus:ring-blue-200/40"
        />
      </div>

      <div>
        <label
          htmlFor="register-repeat-password"
          className="mb-2 block text-sm font-bold text-blue-50"
        >
          Repite la contrase&ntilde;a
        </label>

        <input
          id="register-repeat-password"
          name="repeatPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.target.value)}
          placeholder="Escr&iacute;bela otra vez"
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

      {successMessage ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
        >
          {successMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 text-lg font-extrabold shadow-lg transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
      >
        {isLoading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
      </button>

      <p className="text-center text-sm text-blue-100">
        &iquest;Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-bold text-white underline underline-offset-4 hover:text-blue-100"
        >
          Iniciar sesi&oacute;n
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