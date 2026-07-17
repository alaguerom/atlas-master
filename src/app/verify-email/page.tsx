import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Correo confirmado"
      subtitle="Tu cuenta de Atlas Master ya est&aacute; preparada."
    >
      <div className="space-y-5 text-center">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-800">
          Ya puedes iniciar sesi&oacute;n utilizando el correo y la
          contrase&ntilde;a que elegiste al registrarte.
        </div>

        <Link
          href="/login"
          className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 text-lg font-extrabold shadow-lg transition hover:bg-emerald-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
        >
          INICIAR SESI&Oacute;N
        </Link>

        <Link
          href="/"
          className="block text-sm font-semibold text-blue-100 hover:text-white"
        >
          &larr; Volver al inicio
        </Link>
      </div>
    </AuthLayout>
  );
}