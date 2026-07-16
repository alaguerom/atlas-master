type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "inline-flex min-h-12 items-center justify-center rounded-2xl px-8 py-3 text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-white/30";

  const variantStyles = {
    primary:
      "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98]",
    secondary:
      "border border-white/30 bg-white/10 text-white hover:bg-white/20 active:scale-[0.98]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
}
