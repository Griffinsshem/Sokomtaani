"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Image as ImageIcon, Mail, MapPin, Phone, Upload } from "lucide-react";

import api, { errorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import ListingImage from "../../components/ListingImage";
import NavBar from "../../components/NavBar";
import RequireAuth from "../../components/RequireAuth";
import { ErrorState, LoadingState } from "../../components/StatusMessage";
import { useToast } from "../../components/Toast";

const EMPTY = { title: "", description: "", price: "", category_id: "", image_url: "", is_sold: false };
const inputCls =
  "w-full rounded-lg border border-green-700 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500";

function ListingFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = /^\d+$/.test(params.get("edit") || "") ? params.get("edit") : null;
  const { user } = useAuth();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    const requests = [api.get("categories/")];
    if (editId) requests.push(api.get(`listings/${editId}`));
    Promise.all(requests)
      .then(([cats, listingRes]) => {
        if (!active) return;
        setCategories(cats.data);
        if (listingRes) {
          const l = listingRes.data;
          if (user && l.user_id !== user.id) {
            setLoadError("You can only edit your own listings.");
            return;
          }
          setFormData({
            title: l.title || "",
            description: l.description || "",
            price: String(l.price ?? ""),
            category_id: String(l.category_id ?? ""),
            image_url: l.image_url || "",
            is_sold: !!l.is_sold,
          });
        } else {
          setFormData(EMPTY);
        }
      })
      .catch((err) => active && setLoadError(errorMessage(err, "We couldn't load the form.")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [editId, user, reloadKey]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category_id: parseInt(formData.category_id, 10),
      image_url: formData.image_url.trim(),
    };
    try {
      if (editId) {
        await api.patch(`listings/${editId}`, { ...payload, is_sold: formData.is_sold });
        toast.success("Listing updated");
        router.push("/my-listings");
      } else {
        const res = await api.post("listings/", payload);
        toast.success("Your ad is live!");
        router.push(`/listings/${res.data.id}`);
      }
    } catch (error) {
      setSubmitError(errorMessage(error, "We couldn't save your listing. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main id="main" className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-green-800">
          {editId ? "Edit your listing" : "Post your agricultural product"}
        </h1>
        <p className="text-lg text-green-700">
          {editId ? "Update the details buyers see." : "Reach buyers directly with your fresh farm products"}
        </p>
      </div>

      {loading ? (
        <LoadingState label="Loading form…" />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : (
        <div className="rounded-lg border border-green-600 bg-white p-6 shadow-lg sm:p-8">
          {submitError && (
            <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-3 text-red-800" role="alert">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-green-900">
                Product title <span aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                maxLength={150}
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Fresh organic tomatoes"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-green-900">
                Description <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                maxLength={5000}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product (quality, freshness, quantity, packaging…)"
                className={`${inputCls} resize-y`}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-medium text-green-900">
                  Price (KSh) <span aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-green-700"
                    aria-hidden="true"
                  >
                    KSh
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    max="1000000000"
                    step="0.01"
                    inputMode="decimal"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={`${inputCls} pl-14`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category_id" className="mb-2 block text-sm font-medium text-green-900">
                  Category <span aria-hidden="true">*</span>
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className={`${inputCls} bg-white`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="image_url" className="mb-2 block text-sm font-medium text-green-900">
                Product image URL
              </label>
              <div className="relative">
                <ImageIcon
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                  size={20}
                  aria-hidden="true"
                />
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  maxLength={250}
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  aria-describedby="image_url-hint"
                  className={`${inputCls} pl-10`}
                />
              </div>
              <p id="image_url-hint" className="mt-1 text-sm text-green-900">
                Optional. Use a direct link to an image file (ending in .jpg, .png or .webp).
              </p>
              {formData.image_url && (
                <div className="mt-3 h-40 w-full max-w-xs overflow-hidden rounded-lg border border-green-200">
                  <ListingImage src={formData.image_url} alt="Image preview" />
                </div>
              )}
            </div>

            {editId && (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <input
                  type="checkbox"
                  id="is_sold"
                  name="is_sold"
                  checked={formData.is_sold}
                  onChange={handleInputChange}
                  className="h-5 w-5 accent-green-600"
                />
                <label htmlFor="is_sold" className="font-medium text-gray-900">
                  Mark as sold
                </label>
              </div>
            )}

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h2 className="mb-1 text-lg font-semibold text-green-800">Your contact information</h2>
              <p className="mb-3 text-sm text-green-900">Buyers will see these details on your listing.</p>
              <div className="grid grid-cols-1 gap-4 text-base md:grid-cols-3">
                {[
                  { icon: Mail, label: "Email", value: user?.email },
                  { icon: Phone, label: "Phone", value: user?.phone },
                  { icon: MapPin, label: "Location", value: user?.location },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon size={18} className="text-green-700" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm text-green-800">{label}</p>
                      <p className="truncate font-medium text-gray-900">{value || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse justify-center gap-3 pt-4 sm:flex-row">
              {editId && (
                <button
                  type="button"
                  onClick={() => router.push("/my-listings")}
                  className="rounded-lg bg-gray-200 px-8 py-3 font-semibold text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex min-w-[200px] items-center justify-center gap-2 rounded-lg bg-green-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload size={20} aria-hidden="true" />
                {submitting ? "Saving…" : editId ? "Save changes" : "Post your ad"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default function ListingFormPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <RequireAuth>
        <Suspense fallback={<LoadingState label="Loading form…" />}>
          <ListingFormInner />
        </Suspense>
      </RequireAuth>
      <Footer />
    </div>
  );
}
