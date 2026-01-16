export default function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm " +
        "text-slate-900 placeholder:text-slate-400 shadow-sm outline-none " +
        "focus:border-slate-400 focus:ring-2 focus:ring-slate-200 " +
        className
      }
      {...props}
    />
  );
}
