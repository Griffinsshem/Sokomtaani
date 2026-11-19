"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { errorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import AuthCard from "../../components/AuthCard";
import { FormAlert, PasswordField, TextField } from "../../components/FormField";
import GuestOnly from "../../components/GuestOnly";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function LoginForm() {
  const { login } = useAuth();
  const params = useSearchParams();
  const next = params.get("next");
  const [generalError, setGeneralError] = useState("");

  const handleLogin = async (values, { setSubmitting }) => {
    setGeneralError("");
    try {
      await login(values.email.trim(), values.password, next);
    } catch (err) {
      setGeneralError(errorMessage(err, "Login failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      footer={
        <>
          <p>
            <Link href="/forgot-password" className="font-medium text-green-700 hover:underline">
              Forgot password?
            </Link>
          </p>
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
              className="font-medium text-green-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </>
      }
    >
      <FormAlert>{generalError}</FormAlert>
      <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleLogin}>
        {({ isSubmitting }) => (
          <Form className="space-y-4 text-left" noValidate>
            <TextField name="email" label="Email" type="email" autoComplete="email" inputMode="email" />
            <PasswordField name="password" label="Password" autoComplete="current-password" />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg bg-green-600 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? "Logging in…" : "Log in"}
            </motion.button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <GuestOnly>
        <LoginForm />
      </GuestOnly>
    </Suspense>
  );
}
