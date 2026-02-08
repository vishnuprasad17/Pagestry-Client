import { forwardRef } from "react";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

type InputProps = {
  label: string;
  error?: FieldError;
  textarea?: boolean;
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({ label, error, textarea, ...props }, ref) => {
  const Component = textarea ? "textarea" : "input";

  return (
    <div className="relative">
      <label className="text-sm font-medium">{label}</label>

      <Component
        ref={ref as any}
        {...props}
        rows={textarea ? 3 : undefined}
        className={`w-full mt-1 px-3 py-2 border rounded-md resize-none pr-10
        focus:outline-none focus:ring-2 focus:ring-black
        ${error ? "border-red-500" : "border-gray-300"}
        `}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;