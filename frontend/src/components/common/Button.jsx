import React from "react";

const variantStyles = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  ghost: "bg-transparent text-ink dark:text-canvas hover:bg-black/5 dark:hover:bg-white/5",
  danger: "bg-danger text-white hover:opacity-90",
  outline: "border border-border text-ink dark:text-canvas hover:bg-black/5 dark:hover:bg-white/5",
};

// generic button used everywhere — pass variant + size, everything else
// (onClick, type, disabled...) just flows through via ...rest
export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  ...rest
}) {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm";

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeClass} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
