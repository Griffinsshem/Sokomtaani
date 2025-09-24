"use client";

import { useState } from "react";
import Link from "next/link";

export default function ListingForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [location, setLocation] = useState("");
    const [contacts, setContacts] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setSubmitting(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const payload = {
                title,
                description,
                price: Number(price),
                image_url: imageUrl || null,
                category_id: category ? Number(category) : null,
                location: location || null,
                contacts: contacts || null,
            };

            const response = await fetch("/api/listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setMessage("Listing submitted successfully.");
                setTitle("");
                setDescription("");
                setPrice("");
                setCategory("");
                setImageUrl("");
                setLocation("");
                setContacts("");
            } else {
                const data = await response.json().catch(() => ({}));
                setMessage(data.error || `Submission failed (status ${response.status}).`);
            }
        } catch (error) {
            setMessage("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 12px",
        border: "1px solid #d1d5db",
        borderRadius: 8,
        marginTop: 6,
        background: "#ffffff",
    };

    const isSuccess = message && message.toLowerCase().includes("success");

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)",
                padding: 20,
            }}
        >
            <div
                style={{
                    width: "60vw",
                    maxWidth: 720,
                    background: "#ffffff",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    border: "1px solid #e5e7eb",
                    padding: 20,
                }}
            >
                <h1 style={{ marginBottom: 16, color: "#111827" }}>Post a New Listing</h1>
                <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                    <label>
                        Title
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title"
                            style={inputStyle}
                            required
                        />
                    </label>
                    <label>
                        Description
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your listing"
                            rows={4}
                            style={{ ...inputStyle, resize: "vertical" }}
                            required
                        />
                    </label>
                    <label>
                        Category
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            style={inputStyle}
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            <option value="1">Electronics</option>
                            <option value="2">Home</option>
                            <option value="3">Vehicles</option>
                            <option value="4">Jobs</option>
                            <option value="5">Services</option>
                            <option value="6">Other</option>
                        </select>
                    </label>
                    <label>
                        Price
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            style={inputStyle}
                            required
                        />
                    </label>
                    <label>
                        Image URL
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        Location
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, Area"
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        Contacts
                        <input
                            type="text"
                            value={contacts}
                            onChange={(e) => setContacts(e.target.value)}
                            placeholder="Phone or email"
                            style={inputStyle}
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            background: submitting
                                ? "linear-gradient(135deg, #c4b5fd 0%, #93c5fd 100%)"
                                : "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                            color: "#ffffff",
                            padding: "10px 16px",
                            borderRadius: 8,
                            border: "none",
                            cursor: submitting ? "not-allowed" : "pointer",
                        }}
                    >
                        {submitting ? "Submitting..." : "Post Listing"}
                    </button>
                    {message && (
                        <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
                            <p style={{ color: isSuccess ? "#065f46" : "#b91c1c" }}>{message}</p>
                            {isSuccess && (
                                <Link href="/" style={{ color: "#2563eb", textDecoration: "underline" }}>
                                    View on homepage
                                </Link>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}


