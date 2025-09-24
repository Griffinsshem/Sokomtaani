"use client"; 
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import NavBar from "../../components/NavBar"; 

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
        // Combine API categories with static ones
        const staticCategories = [
          { id: "static-veg", name: "Vegetables" },
          { id: "static-fruits", name: "Fruits" },
          { id: "static-livestock", name: "Livestock" },
          { id: "static-seeds", name: "Seeds & Seedlings" },
          { id: "static-tools", name: "Farm Tools" },
        ];
        setCategories([...staticCategories, ...res.data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
        // fallback to static categories if API fails
        setCategories([
          { id: "static-veg", name: "Vegetables" },
          { id: "static-fruits", name: "Fruits" },
          { id: "static-livestock", name: "Livestock" },
          { id: "static-seeds", name: "Seeds & Seedlings" },
          { id: "static-tools", name: "Farm Tools" },
        ]);
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

        setMessage("✅ Listing created successfully!");
        formik.resetForm();
        setImageFile(null);
        router.push("/my-listings"); 
      } catch (err) {
        setMessage("❌ Error: " + (err.response?.data?.error || "Something went wrong"));
      }
    },
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
      {/* Navbar */}
      <NavBar />

      <main className="relative z-10 p-6 max-w-lg mx-auto text-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-green-700">Post a New Listing</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={formik.values.title}
            onChange={formik.handleChange}
            className="border p-2 w-full rounded text-black placeholder-gray-500"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-600 text-sm">{formik.errors.title}</div>
          )}

          {/* Description */}
          <textarea
            name="description"
            placeholder="Describe your listing"
            value={formik.values.description}
            onChange={formik.handleChange}
            className="border p-2 w-full rounded text-black placeholder-gray-500"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-600 text-sm">{formik.errors.description}</div>
          )}

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="0.00"
            value={formik.values.price}
            onChange={formik.handleChange}
            className="border p-2 w-full rounded text-black placeholder-gray-500"
          />
          {formik.touched.price && formik.errors.price && (
            <div className="text-red-600 text-sm">{formik.errors.price}</div>
          )}

          {/* Image Upload */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="border p-2 w-full rounded text-gray-700"
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded border"
            />
          )}

          {/* Category Dropdown */}
          <select
            name="category_id"
            value={formik.values.category_id}
            onChange={formik.handleChange}
            className="border p-2 w-full rounded text-black"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {formik.touched.category_id && formik.errors.category_id && (
            <div className="text-red-600 text-sm">{formik.errors.category_id}</div>
          )}

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formik.values.location}
            onChange={formik.handleChange}
            className="border p-2 w-full rounded text-black placeholder-gray-500"
          />

          {/* Contacts */}
          <input
            type="text"
            name="contacts"
            placeholder="Contacts (Email/Phone)"
            value={formik.values.contacts}
            onChange={formik.handleChange}
            className="border p-2 w-full rounded text-black placeholder-gray-500"
          />
          {formik.touched.contacts && formik.errors.contacts && (
            <div className="text-red-600 text-sm">{formik.errors.contacts}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
          >
            Post Listing
          </button>
        </form>

        {/* Message */}
        {message && <p className="mt-4 font-medium">{message}</p>}
      </main>
    </div>
  );
}
