type SecondaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function SecondaryButton({
  children,
  onClick,
  type = "button",
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-2xl
        border-2
        border-white/70
        bg-white/10
        px-6
        py-4
        text-lg
        font-semibold
        text-white
        backdrop-blur-sm
        transition
        hover:bg-white/20
        active:scale-95
      "
    >
      {children}
    </button>
  );
}