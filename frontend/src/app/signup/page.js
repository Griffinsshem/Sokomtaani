"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { errorMessage } from "../../lib/api";
import { PASSWORD_HINT, PHONE_REGEX, confirmRule, passwordRule } from "../../lib/validation";
import { useAuth } from "../../context/AuthContext";
import AuthCard from "../../components/AuthCard";
import { FormAlert, PasswordField, TextField } from "../../components/FormField";
import GuestOnly from "../../components/GuestOnly";

const SignupSchema = Yup.object().shape({
  fullName: Yup.string().trim().min(2, "Too short").max(50, "Too long").required("Full name is required"),
  email: Yup.string().email("Enter a valid email address").max(120).required("Email is required"),
  phone: Yup.string()
    .trim()
    .matches(PHONE_REGEX, "Enter a valid phone number, e.g. 0712345678 or +254712345678")
    .required("Phone number is required"),
  location: Yup.string().trim().max(100, "Too long").required("Location is required"),
  password: passwordRule,
  confirmPassword: confirmRule("password"),
});

function SignupForm() {
  const { signup } = useAuth();
  const params = useSearchParams();
  const next = params.get("next");
  const [generalError, setGeneralError] = useState("");

  const handleSignup = async (values, { setSubmitting }) => {
    setGeneralError("");
    try {
      await signup(
        {
          name: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          location: values.location.trim(),
          password: values.password,
        },
        next
      );
    } catch (error) {
      setGeneralError(errorMessage(error, "Sign up failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
            className="font-medium text-green-700 hover:underline"
          >
            Log in
          </Link>
        </p>
      }
    >
      <FormAlert>{generalError}</FormAlert>
      <Formik
        initialValues={{ fullName: "", email: "", phone: "", location: "", password: "", confirmPassword: "" }}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 text-left" noValidate>
            <TextField name="fullName" label="Full name" autoComplete="name" />
            <TextField name="email" label="Email" type="email" autoComplete="email" inputMode="email" />
            <TextField
              name="phone"
              label="Phone number"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              hint="Buyers will use this to call or WhatsApp you."
            />
            <TextField name="location" label="Location" autoComplete="address-level2" hint="e.g. Nakuru" />
            <PasswordField name="password" label="Password" autoComplete="new-password" hint={PASSWORD_HINT} />
            <PasswordField name="confirmPassword" label="Confirm password" autoComplete="new-password" />
            <p className="text-xs text-gray-700">
              By signing up you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? "Creating account…" : "Sign up"}
            </motion.button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <GuestOnly>
        <SignupForm />
      </GuestOnly>
    </Suspense>
  );
}
