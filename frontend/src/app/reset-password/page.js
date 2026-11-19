"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { errorMessage } from "../../lib/api";
import { PASSWORD_HINT, confirmRule, passwordRule } from "../../lib/validation";
import { useAuth } from "../../context/AuthContext";
import AuthCard from "../../components/AuthCard";
import { FormAlert, PasswordField } from "../../components/FormField";

const ResetSchema = Yup.object().shape({
  password: passwordRule,
  confirmPassword: confirmRule("password"),
});

function ResetForm() {
  const { resetPassword } = useAuth();
  const token = useSearchParams().get("token") || "";
  const [done, setDone] = useState("");
  const [errorText, setErrorText] = useState("");

  if (!token) {
    return (
      <AuthCard title="Reset password">
        <FormAlert>This reset link is incomplete. Please request a new one.</FormAlert>
        <Link href="/forgot-password" className="block text-center font-medium text-green-700 hover:underline">
          Request a new link
        </Link>
      </AuthCard>
    );
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorText("");
    try {
      setDone(await resetPassword(token, values.password));
    } catch (error) {
      setErrorText(errorMessage(error, "We couldn't reset your password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Set a new password">
      {done ? (
        <>
          <FormAlert type="success">{done}</FormAlert>
          <Link
            href="/login"
            className="block w-full rounded-lg bg-green-600 py-3 text-center font-semibold text-white hover:bg-green-700"
          >
            Go to login
          </Link>
        </>
      ) : (
        <>
          <FormAlert>
            {errorText}
            {errorText && (
              <>
                {" "}
                <Link href="/forgot-password" className="underline">
                  Request a new link
                </Link>
              </>
            )}
          </FormAlert>
          <Formik initialValues={{ password: "", confirmPassword: "" }} validationSchema={ResetSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-4 text-left" noValidate>
                <PasswordField name="password" label="New password" autoComplete="new-password" hint={PASSWORD_HINT} />
                <PasswordField name="confirmPassword" label="Confirm new password" autoComplete="new-password" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving…" : "Save new password"}
                </button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
