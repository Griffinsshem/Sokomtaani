"use client";

import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Mail, MapPin, Phone, User } from "lucide-react";

import { errorMessage } from "../../lib/api";
import { PASSWORD_HINT, confirmRule, passwordRule } from "../../lib/validation";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import { FormAlert, PasswordField } from "../../components/FormField";
import NavBar from "../../components/NavBar";
import RequireAuth from "../../components/RequireAuth";
import { useToast } from "../../components/Toast";

const ChangeSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Enter your current password"),
  newPassword: passwordRule.notOneOf([Yup.ref("currentPassword")], "Choose a different password"),
  confirmPassword: confirmRule("newPassword"),
});

function AccountInner() {
  const { user, changePassword } = useAuth();
  const toast = useToast();
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setErrorText("");
    try {
      await changePassword(values.currentPassword, values.newPassword);
      toast.success("Password updated");
      resetForm();
    } catch (error) {
      setErrorText(errorMessage(error, "We couldn't change your password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main id="main" className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold text-green-800">My account</h1>

      <section className="mb-8 rounded-lg bg-white p-6 shadow-lg" aria-labelledby="profile-heading">
        <h2 id="profile-heading" className="mb-4 text-xl font-semibold text-green-800">
          Profile
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { icon: User, label: "Name", value: user?.name },
            { icon: Mail, label: "Email", value: user?.email },
            { icon: Phone, label: "Phone", value: user?.phone },
            { icon: MapPin, label: "Location", value: user?.location },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={18} className="text-green-700" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-sm text-gray-600">{label}</dt>
                <dd className="truncate font-medium text-gray-900">{value || "—"}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-lg" aria-labelledby="password-heading">
        <h2 id="password-heading" className="mb-4 text-xl font-semibold text-green-800">
          Change password
        </h2>
        <FormAlert>{errorText}</FormAlert>
        <Formik
          initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
          validationSchema={ChangeSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="max-w-md space-y-4" noValidate>
              <PasswordField name="currentPassword" label="Current password" autoComplete="current-password" />
              <PasswordField name="newPassword" label="New password" autoComplete="new-password" hint={PASSWORD_HINT} />
              <PasswordField name="confirmPassword" label="Confirm new password" autoComplete="new-password" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving…" : "Update password"}
              </button>
            </Form>
          )}
        </Formik>
      </section>
    </main>
  );
}

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <RequireAuth>
        <AccountInner />
      </RequireAuth>
      <Footer />
    </div>
  );
}
