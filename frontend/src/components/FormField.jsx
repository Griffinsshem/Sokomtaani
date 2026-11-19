"use client";

import React, { useState } from "react";
import { ErrorMessage, Field } from "formik";
import { Eye, EyeOff } from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-gray-400 bg-white/90 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600";

/** Labelled Formik field with an accessible, linked error message. */
export function TextField({ name, label, type = "text", autoComplete, hint, ...rest }) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-800">
        {label}
      </label>
      <Field name={name}>
        {({ field, meta }) => (
          <input
            {...field}
            {...rest}
            id={name}
            type={type}
            autoComplete={autoComplete}
            aria-invalid={meta.touched && meta.error ? "true" : undefined}
            aria-describedby={`${hint ? `${name}-hint ` : ""}${errorId}`}
            className={inputCls}
          />
        )}
      </Field>
      {hint && (
        <p id={`${name}-hint`} className="mt-1 text-xs text-gray-600">
          {hint}
        </p>
      )}
      <ErrorMessage name={name}>
        {(msg) => (
          <p id={errorId} className="mt-1 text-sm text-red-700" role="alert">
            {msg}
          </p>
        )}
      </ErrorMessage>
    </div>
  );
}

/** Password field with a real, keyboard-accessible show/hide button. */
export function PasswordField({ name, label, autoComplete = "current-password", hint }) {
  const [visible, setVisible] = useState(false);
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-800">
        {label}
      </label>
      <div className="relative">
        <Field name={name}>
          {({ field, meta }) => (
            <input
              {...field}
              id={name}
              type={visible ? "text" : "password"}
              autoComplete={autoComplete}
              aria-invalid={meta.touched && meta.error ? "true" : undefined}
              aria-describedby={`${hint ? `${name}-hint ` : ""}${errorId}`}
              className={`${inputCls} pr-12`}
            />
          )}
        </Field>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls={name}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-600 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600"
        >
          {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
        </button>
      </div>
      {hint && (
        <p id={`${name}-hint`} className="mt-1 text-xs text-gray-600">
          {hint}
        </p>
      )}
      <ErrorMessage name={name}>
        {(msg) => (
          <p id={errorId} className="mt-1 text-sm text-red-700" role="alert">
            {msg}
          </p>
        )}
      </ErrorMessage>
    </div>
  );
}

export function FormAlert({ type = "error", children }) {
  if (!children) return null;
  const cls =
    type === "success"
      ? "border-green-300 bg-green-50 text-green-800"
      : "border-red-300 bg-red-50 text-red-800";
  return (
    <div className={`mb-4 rounded-lg border p-3 text-sm ${cls}`} role={type === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
