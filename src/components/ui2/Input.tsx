// src/components/ui2/input.tsx
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
