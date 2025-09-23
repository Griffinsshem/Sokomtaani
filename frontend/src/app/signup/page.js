"use client";

import React from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";

// Password Regex: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const SignupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  location: Yup.string().required("Location is required"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must be 8+ chars, include uppercase, lowercase, number & special char"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function SignupPage() {
  const { signup } = useAuth();

  const handleSignup = async (values, { setSubmitting, setErrors }) => {
    try {
      await signup({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        location: values.location,
        password: values.password,
      });
    } catch (error) {
      console.error(error);
      setErrors({
        email: error.response?.data?.message || "Signup failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
      {/* Animated background blobs */}
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
          Create Your Account
        </h2>

        <Formik
          initialValues={{
            fullName: "",
            email: "",
            phone: "",
            location: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting, values, handleChange }) => (
            <Form className="space-y-4 text-left">
              {/* Full Name */}
              <div>
                <Field
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/90"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/90"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Phone */}
              <div>
                <Field
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/90"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Location */}
              <div>
                <Field
                  name="location"
                  placeholder="Location"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/90"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/90"
                  onChange={handleChange}
                  value={values.password}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be 8+ chars, include uppercase, lowercase, number & special character
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/90"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-md transition mt-2"
              >
                {isSubmitting ? "Submitting..." : "Sign Up"}
              </motion.button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
