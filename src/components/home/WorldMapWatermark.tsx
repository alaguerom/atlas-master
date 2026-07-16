export default function WorldMapWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <img
        src="/images/backgrounds/world-map.svg"
        alt=""
        className="
          absolute
          left-1/2
          top-1/2
          h-auto
          w-[125%]
          max-w-none
          -translate-x-1/2
          -translate-y-1/2
          opacity-[0.18]
          mix-blend-multiply
          sm:w-[112%]
          lg:w-[100%]
        "
      />
    </div>
  );
}
