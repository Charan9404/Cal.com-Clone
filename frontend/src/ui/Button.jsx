export default function Button({
  children,
  variant = "primary", // primary | secondary | danger | ghost
  className = "",
  disabled,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 ring-offset-white",
    secondary:
      "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300 ring-offset-white",
    danger:
      "bg-red-600 text-white hover:bg-red-500 focus:ring-red-600 ring-offset-white",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300 ring-offset-white",
  };

  return (
    <button
      className={`${base} ${styles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
