interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "success" | "danger" | "muted";
  className?: string;
}

const variants = {
  gold: "bg-gold-muted text-gold border-gold/20",
  success: "bg-success/10 text-success border-success/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  muted: "bg-surface-light text-muted border-surface-border",
};

export function Badge({ children, variant = "gold", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
