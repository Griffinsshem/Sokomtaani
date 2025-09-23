"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function ListingForm() {
  const { token } = useAuth();
  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      image_url: "",
      category_id: ""
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      price: Yup.number().positive().required("Price is required"),
      category_id: Yup.number().required("Category is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await api.post("/listings", values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("Listing created successfully!");
        formik.resetForm();
      } catch (err) {
        setMessage("Error: " + (err.response?.data?.error || "Something went wrong"));
      }
    },
  });

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Post a New Listing</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        />
        {formik.touched.title && formik.errors.title && (
          <div className="text-red-500">{formik.errors.title}</div>
        )}

        <textarea
          name="description"
          placeholder="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formik.values.price}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        />
        {formik.touched.price && formik.errors.price && (
          <div className="text-red-500">{formik.errors.price}</div>
        )}

        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          value={formik.values.image_url}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        />

        <input
          type="number"
          name="category_id"
          placeholder="Category ID"
          value={formik.values.category_id}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        />
        {formik.touched.category_id && formik.errors.category_id && (
          <div className="text-red-500">{formik.errors.category_id}</div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
