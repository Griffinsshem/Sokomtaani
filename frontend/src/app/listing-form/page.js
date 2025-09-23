"use client"; // must be first line

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function ListingForm() {
  const { token } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category_id: "",
      location: "",
      contacts: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number().positive("Price must be greater than 0").required("Price is required"),
      category_id: Yup.string().required("Category is required"),
      location: Yup.string(),
      contacts: Yup.string().required("Contacts are required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("category_id", values.category_id);
        formData.append("location", values.location);
        formData.append("contacts", values.contacts);
        if (imageFile) formData.append("image", imageFile);

        await api.post("/listings", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Listing created successfully!");
        formik.resetForm();
        setImageFile(null);
        router.push("/my-listings"); // Redirect to My Listings
      } catch (err) {
        setMessage("Error: " + (err.response?.data?.error || "Something went wrong"));
      }
    },
  });

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Post a New Listing</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={formik.values.title}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        />
        {formik.touched.title && formik.errors.title && (
          <div className="text-red-500">{formik.errors.title}</div>
        )}

        {/* Description */}
        <textarea
          name="description"
          placeholder="Describe your listing"
          value={formik.values.description}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-red-500">{formik.errors.description}</div>
        )}

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="0.00"
          value={formik.values.price}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        />
        {formik.touched.price && formik.errors.price && (
          <div className="text-red-500">{formik.errors.price}</div>
        )}

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border p-2 w-full"
        />
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover"
          />
        )}

        {/* Category Dropdown */}
        <select
          name="category_id"
          value={formik.values.category_id}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {formik.touched.category_id && formik.errors.category_id && (
          <div className="text-red-500">{formik.errors.category_id}</div>
        )}

        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formik.values.location}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        />

        {/* Contacts */}
        <input
          type="text"
          name="contacts"
          placeholder="Contacts (Email/Phone)"
          value={formik.values.contacts}
          onChange={formik.handleChange}
          className="border p-2 w-full"
        />
        {formik.touched.contacts && formik.errors.contacts && (
          <div className="text-red-500">{formik.errors.contacts}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post Listing
        </button>
      </form>

      {/* Message */}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
