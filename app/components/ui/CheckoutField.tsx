"use client";

import type { ChangeEvent, FocusEvent } from "react";
import type { CheckoutFieldName } from "@/app/lib/checkout";

interface CheckoutFieldProps {
  name: CheckoutFieldName;
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "tel";
  inputMode?: "text" | "email" | "tel" | "numeric";
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  onChange: (name: CheckoutFieldName, value: string) => void;
  onBlur: (
    name: CheckoutFieldName,
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  multiline?: boolean;
}

const fieldClasses =
  "mt-1.5 min-h-11 w-full rounded-lg border bg-[#03100b]/70 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-60";

export function CheckoutField({
  name,
  label,
  value,
  error,
  required = false,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  maxLength,
  disabled = false,
  onChange,
  onBlur,
  multiline = false,
}: CheckoutFieldProps) {
  const id = `checkout-${name}`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-wide text-emerald-50/90"
      >
        {label}
        {required && (
          <span className="ml-1 text-emerald-300" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          required={required}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onChange(name, event.target.value)
          }
          onBlur={(event) => onBlur(name, event)}
          rows={3}
          className={`${fieldClasses} min-h-24 resize-y ${error ? "border-rose-400/80" : "border-white/15"}`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          value={value}
          required={required}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(name, event.target.value)
          }
          onBlur={(event) => onBlur(name, event)}
          className={`${fieldClasses} ${error ? "border-rose-400/80" : "border-white/15"}`}
        />
      )}
      <p
        id={errorId}
        className="mt-1 min-h-4 text-xs text-rose-300"
        role={error ? "alert" : undefined}
      >
        {error ?? " "}
      </p>
    </div>
  );
}
