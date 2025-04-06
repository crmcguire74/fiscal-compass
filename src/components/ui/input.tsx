import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
  onValueChange?: (value: any) => void;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, onChange, onValueChange, onClear, value, ...props },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === "number") {
        // Allow backspace and delete keys
        if (e.key === "Backspace" || e.key === "Delete") {
          return;
        }

        // Clear on 'c' key for calculator-like clear functionality
        if (e.key.toLowerCase() === "c") {
          e.preventDefault();
          if (onClear) {
            onClear();
          } else if (onValueChange) {
            onValueChange("");
          }
          return;
        }

        // Prevent non-numeric input (allow decimal point and minus for negative numbers)
        if (
          !/^[0-9.\-]$/.test(e.key) &&
          !["ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
        ) {
          e.preventDefault();
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Always call the original onChange handler
      if (onChange) {
        onChange(e);
      }

      // Call our custom value handler if provided
      if (onValueChange) {
        if (type === "number") {
          // Handle empty or invalid input
          if (e.target.value === "" || e.target.value === "-") {
            onValueChange(e.target.value);
            return;
          }

          const num = parseFloat(e.target.value);
          if (!isNaN(num)) {
            onValueChange(num);
          }
        } else {
          onValueChange(e.target.value);
        }
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
