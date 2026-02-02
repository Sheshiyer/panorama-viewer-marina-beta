export const glass =
  "backdrop-blur-xl bg-slate-900/55 border border-white/10 shadow-[0_18px_60px_rgba(15,23,42,0.55)]";
export const roundedPanel = "rounded-2xl";
export const pressable =
  "transition-all duration-200 hover:bg-white/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";
export const disabledState = "opacity-40 grayscale cursor-not-allowed";
export const activeGradient = "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950";
export const loadingSpinner = "w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin";

// Black/Gold/White Theme
export const goldBorderGradient =
  "relative border-2 border-transparent " +
  "before:absolute before:inset-0 before:rounded-[inherit] before:p-[2px] " +
  "before:bg-gradient-to-r before:from-amber-400 before:to-amber-600 " +
  "before:-z-10";

export const blackGoldTheme = {
  iconBg: "bg-black",
  iconBorder: "border-white/30",
  iconText: "text-white",
  activeGoldBorder: goldBorderGradient,
  activeText: "text-amber-400",
};
