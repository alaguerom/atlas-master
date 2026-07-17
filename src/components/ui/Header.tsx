export default function Header() {
  return (
    <header className="absolute top-0 left-0 z-20 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="text-xl font-bold tracking-wide text-white">
          ATLAS MASTER
        </div>

        <div className="flex items-center gap-3">
          <button
            className="rounded-full border border-white/30 px-3 py-2 text-white transition hover:bg-white/10"
            aria-label="Idioma"
          >
            🌍
          </button>

          <button
            className="rounded-full border border-white/30 px-3 py-2 text-white transition hover:bg-white/10"
            aria-label="Configuración"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}