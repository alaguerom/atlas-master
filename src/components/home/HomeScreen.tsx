import Image from "next/image";
import Link from "next/link";
import WorldMapWatermark from "@/components/home/WorldMapWatermark";

export default function HomeScreen() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 px-5 py-8 text-white">
      <WorldMapWatermark />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
        <Image
          src="/images/logo/atlas-master-logo.png"
          alt="Atlas Master"
          width={170}
          height={170}
          priority
          className="mb-6 h-auto w-36 rounded-[22%] shadow-xl sm:w-40 md:w-44 lg:w-48"
        />

        <h1 className="text-5xl font-black tracking-tight drop-shadow-sm sm:text-6xl md:text-7xl">
          ATLAS MASTER
        </h1>

        <div className="mt-5 flex w-full max-w-xs items-center gap-4 text-blue-100 sm:max-w-sm">
          <span className="h-px flex-1 bg-blue-100/70" />
          <span aria-hidden="true" className="text-xl">
            &#9733;
          </span>
          <span className="h-px flex-1 bg-blue-100/70" />
        </div>

        <p className="mt-5 max-w-xl text-xl font-medium leading-snug text-blue-50 sm:text-2xl">
          Aprende a reconocer
          <br />
          todos los pa&iacute;ses del mundo.
        </p>

        <nav
          aria-label="Acciones principales"
          className="mt-8 flex w-full max-w-md flex-col gap-4"
        >
          <button
            type="button"
            className="flex min-h-16 w-full items-center justify-center gap-4 rounded-2xl bg-emerald-500 px-6 text-2xl font-extrabold shadow-lg transition hover:bg-emerald-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
          >
            <span aria-hidden="true">&#9654;</span>
            JUGAR
          </button>

          <Link
            href="/login"
            className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/90 bg-blue-700/20 px-6 text-lg font-bold transition hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 sm:text-xl"
          >
            <span aria-hidden="true">&#128100;</span>
            INICIAR SESI&Oacute;N
          </Link>

          <Link
            href="/register"
            className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/90 bg-blue-700/20 px-6 text-lg font-bold transition hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 sm:text-xl"
          >
            <span aria-hidden="true">&#128100; +</span>
            REGISTRARSE
          </Link>
        </nav>

        <footer className="mt-10 w-full max-w-lg text-blue-100">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-blue-100/60" />
            <span aria-hidden="true" className="text-2xl">
              &#9673;
            </span>
            <span className="h-px flex-1 bg-blue-100/60" />
          </div>

          <p className="mt-4 text-sm sm:text-base">
            &copy; 2026 Atlas Master. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </main>
  );
}