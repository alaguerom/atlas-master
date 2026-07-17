type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
}: PrimaryButtonProps) {
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
        bg-emerald-500
        px-6
        py-4
        text-xl
        font-bold
        text-white
        shadow-lg
        transition
        hover:bg-emerald-600
        active:scale-95
      "
    >
      {children}
    </button>
  );
}