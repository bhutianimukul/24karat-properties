import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-surface rounded-xl border border-surface-border
        ${hover ? "transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
