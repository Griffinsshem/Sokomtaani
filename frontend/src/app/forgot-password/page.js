"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { errorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import AuthCard from "../../components/AuthCard";
import { FormAlert, TextField } from "../../components/FormField";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [sentMessage, setSentMessage] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorText("");
    try {
      setSentMessage(await forgotPassword(values.email.trim()));
    } catch (error) {
      setErrorText(errorMessage(error, "We couldn't send the reset link. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Forgot password"
      footer={
        <p>
          Remembered your password?{" "}
          <Link href="/login" className="font-medium text-green-700 hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      {sentMessage ? (
        <FormAlert type="success">
          {sentMessage} Check your inbox (and spam folder). The link expires in 1 hour.
        </FormAlert>
      ) : (
        <>
          <p className="mb-4 text-center text-gray-700">
            Enter your account email and we&apos;ll send you a link to set a new password.
          </p>
          <FormAlert>{errorText}</FormAlert>
          <Formik initialValues={{ email: "" }} validationSchema={ForgotPasswordSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-4 text-left" noValidate>
                <TextField name="email" label="Email" type="email" autoComplete="email" inputMode="email" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-lg bg-green-600 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending…" : "Send reset link"}
                </button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </AuthCard>
  );
}
