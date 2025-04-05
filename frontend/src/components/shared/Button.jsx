import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Button = forwardRef(
  ({ className, children, variant = 'default', size = 'default', isLoading = false, disabled, href, ...props }, ref) => {
    const buttonClasses = cn(
      "relative inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
      // Variants
      variant === 'default' && "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      variant === 'outline' && "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      variant === 'ghost' && "hover:bg-accent hover:text-accent-foreground",
      variant === 'link' && "text-primary underline-offset-4 hover:underline",
      variant === 'destructive' && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      // Sizes
      size === 'default' && "h-10 px-4 py-2",
      size === 'sm' && "h-9 rounded-md px-3",
      size === 'lg' && "h-11 rounded-md px-8",
      size === 'icon' && "h-10 w-10",
      className
    );

    // If href is provided, render as Link from react-router-dom
    if (href) {
      return (
        <Link 
          to={href} 
          className={buttonClasses}
          {...props}
        >
          {isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {children}
        </Link>
      );
    }

    // Otherwise render as a regular button
    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
