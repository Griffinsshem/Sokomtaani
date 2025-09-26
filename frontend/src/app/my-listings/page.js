"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Edit, Trash2, Eye, Plus, Calendar } from "lucide-react";
import Image from "next/image";

export default function MyListings() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Fetch user's listings
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMyListings = async () => {
      try {
        console.log('Fetching my listings...');
        const res = await api.get("listings/my");
        console.log('Listings fetched successfully:', res.data);
        setListings(res.data);
      } catch (error) {
        console.error("Error fetching listings:", {
          name: error.name,
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });

        if (error.response?.status === 422) {
          console.log('422 Error - Backend validation issue');
        } else if (error.response?.status === 401) {
          router.push('/login');
        } else if (error.message.includes('Network Error')) {
          alert('Cannot connect to server. Make sure backend is running.')
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [isAuthenticated]);

  const handleDeleteListing = async (listingId) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await api.delete(`listings/${listingId}`, { id: listingId });

      setListings(listings.filter(listing => listing.id !== listingId));
      // alert("Listing deleted successfully!");
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Error deleting listing. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Please Login</h2>
            <p className="text-green-600">You need to be logged in to view your listings.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">My Listings</h1>
          <p className="text-green-600 text-lg">Manage your agricultural products</p>
        </div>

        {/* Stats and Action Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-green-700">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-green-600">
                You have {listings.length} active {listings.length === 1 ? 'listing' : 'listings'}
              </p>
            </div>
            <button
              onClick={() => router.push("/listing-form")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Listing
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-green-600 mt-4">Loading your listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">No listings yet</h3>
              <p className="text-green-600 mb-6">Start by creating your first agricultural product listing!</p>
              <button
                onClick={() => router.push("/listing-form")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Create Your First Listing
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-lg border border-green-100 overflow-hidden hover:shadow-xl transition-shadow">
                {/* Listing Image Placeholder */}
                <div className="h-48 bg-green-100 flex items-center justify-center">
                  {listing.image_url ? (
                    <Image
                      src={listing.image_url || '/placeholder-image.jpg'}
                      alt={listing.title}
                      width={400}
                      height={192}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-green-600">
                      <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Eye size={24} />
                      </div>
                      <p className="text-sm">No image</p>
                    </div>
                  )}
                </div>

                {/* Listing Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-green-800 truncate flex-1 mr-2">
                      {listing.title}
                    </h3>
                    <span className="text-2xl font-bold text-green-600 whitespace-nowrap">
                      KSh {listing.price}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar size={16} className="mr-1" />
                    <span>Posted {formatDate(listing.created_at)}</span>
                  </div>

                  <div className="flex items-center text-sm text-green-600 mb-4">
                    <span className="bg-green-50 px-2 py-1 rounded">
                      {listing.location}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4 border-t border-green-100">
                    <button
                      onClick={() => router.push(`/listing-form?edit=${listing.id}`)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit size={16} />
                      <span className="text-sm">Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteListing(listing.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {listings.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Listing Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{listings.length}</div>
                <div className="text-sm text-green-700">Total Listings</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.max(...listings.map(l => l.price), 0).toLocaleString()}
                </div>
                <div className="text-sm text-blue-700">Highest Price</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.min(...listings.map(l => l.price), 0).toLocaleString()}
                </div>
                <div className="text-sm text-yellow-700">Lowest Price</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(listings.map(l => l.category_id)).size}
                </div>
                <div className="text-sm text-purple-700">Categories</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}


