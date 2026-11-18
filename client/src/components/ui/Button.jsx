import { clsx } from "clsx";
import { Button as AnimatedButton } from "@/components/keyframery/button";

const variants = {
  primary: "primary",
  secondary: "default",
  ghost: "ghost",
  danger: "destructive",
};

const sizes = {
  sm: "sm",
  md: "md",
  lg: "lg",
  icon: "icon",
};

export default function Button({
  as: Component = "button",
  className,
  variant = "primary",
  size = "md",
  type = "button",
  to,
  children,
  ...props
}) {
  const render = Component === "button" ? undefined : <Component to={to} />;

  return (
    <AnimatedButton
      className={clsx("font-semibold", className)}
      render={render}
      size={sizes[size] || "md"}
      type={Component === "button" ? type : undefined}
      variant={variants[variant] || "primary"}
      {...props}
    >
      {children}
    </AnimatedButton>
  );
}
