"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext"; 

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth(); 
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleForgotPassword = async (values, { setSubmitting }) => {
    try {
      await forgotPassword(values.email); 
      setSubmitted(true);
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Failed to send reset link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
      {/* Background blobs */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-150px] right-[-150px] w-[28rem] h-[28rem] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white/70 backdrop-blur-2xl shadow-2xl border border-white/30 rounded-3xl p-12 text-center max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Forgot Password
        </h2>

        {submitted ? (
          <p className="text-green-700 text-center mb-4">
            Password reset link has been sent to your email.
          </p>
        ) : (
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleForgotPassword}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 text-left">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/90"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {errorMessage && (
                  <div className="text-red-500 text-sm text-center">{errorMessage}</div>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-md transition mt-2"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </motion.button>
              </Form>
            )}
          </Formik>
        )}

        <p className="mt-4 text-sm text-gray-600 text-center">
          Remembered your password?{" "}
          <a href="/login" className="text-green-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
