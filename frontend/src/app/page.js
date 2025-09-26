"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Leaf, Users, Truck, Star, ArrowRight, Heart, MapPin, Phone, Calendar, Mail, CheckCircle, XCircle } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("listings/");
        setListings(res.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const toggleFavorite = (listingId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId);
    } else {
      newFavorites.add(listingId);
    }
    setFavorites(newFavorites);

    const favoriteIds = Array.from(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Contact seller functions
  const contactByPhone = (phoneNumber) => {
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    window.open(`tel:${formattedPhone}`, '_self');
  };

  const contactByEmail = (email) => {
    window.open(`mailto:${email}`, '_self');
  };

  // Show contact options without alerts
  const showContactOptions = (listing) => {
    const hasPhone = listing.contact_phone && listing.contact_phone.trim() !== '';
    const hasEmail = listing.contact_email && listing.contact_email.trim() !== '';

    if (!hasPhone && !hasEmail) {
      return;
    }

    setSelectedListing(listing);
    setShowContactModal(true);
  };


  const isSold = (listing) => {
    return listing.status === 'sold' || listing.sold === true;
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            SokoMtaani
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connect directly with farmers for the freshest produce.
            No middlemen, better prices for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#products"
              className="bg-yellow-400 text-green-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
            >
              Browse Products <ArrowRight size={20} />
            </Link>
            {isAuthenticated ? (
              <Link
                href="/listing-form"
                className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-700 transition-colors"
              >
                Sell Your Products
              </Link>
            ) : (
              <Link
                href="/signup"
                className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-700 transition-colors"
              >
                Join as Farmer
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Why Choose SokoMtaani?</h2>
            <p className="text-lg text-green-600">The platform built for farmers and buyers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">Fresh from Farm</h3>
              <p className="text-green-600">Direct from farmers to your table, ensuring maximum freshness</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">Fair Prices</h3>
              <p className="text-green-600">Better prices for farmers and affordable rates for buyers</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <Truck className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">Local Delivery</h3>
              <p className="text-green-600">Fast and reliable delivery within your local area</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Fresh Agricultural Products</h2>
            <p className="text-lg text-green-600">Latest products from our trusted farmers</p>
          </div>

          {loading ? (
            <div className="text-center text-lg text-green-600">Loading fresh products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => {
                const isFavorite = favorites.has(listing.id);
                const hasPhone = listing.contact_phone && listing.contact_phone.trim() !== '';
                const hasEmail = listing.contact_email && listing.contact_email.trim() !== '';
                const sold = isSold(listing);

                return (
                  <div key={listing.id} className={`bg-white rounded-lg shadow-lg border overflow-hidden hover:shadow-xl transition-shadow group relative ${sold ? 'border-gray-300 opacity-80' : 'border-green-100'}`}>

                    {/* Status Badge */}
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold ${sold ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {sold ? (
                        <span className="flex items-center gap-1">
                          <XCircle size={12} />
                          SOLD
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <CheckCircle size={12} />
                          AVAILABLE
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => !sold && toggleFavorite(listing.id)}
                      className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:scale-110 transition-transform"
                    >
                      <Heart
                        size={20}
                        className={isFavorite ? "fill-red-500 text-red-500" : sold ? "text-gray-300" : "text-gray-400 hover:text-red-500"}
                      />
                    </button>

                    {/* Product Image with Sold Overlay */}
                    <div className={`h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden ${sold ? 'grayscale' : ''}`}>
                      {listing.image_url ? (
                        <img
                          src={listing.image_url}
                          alt={listing.title}
                          className={`h-full w-full object-cover transition-transform duration-300 ${sold ? '' : 'group-hover:scale-105'}`}
                        />
                      ) : (
                        <div className="text-center text-green-600">
                          <div className={`w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-2 transition-transform ${sold ? '' : 'group-hover:scale-110'}`}>
                            <Leaf size={32} />
                          </div>
                          <p className="text-sm font-medium">Fresh Product</p>
                        </div>
                      )}
                      <div className={`absolute inset-0 transition-colors ${sold ? 'bg-black/30' : 'bg-black/10 group-hover:bg-black/20'}`}></div>

                      {/* Sold Overlay Text */}
                      {sold && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg transform rotate-[-5deg]">
                            SOLD OUT
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={`text-lg font-semibold truncate flex-1 mr-2 transition-colors ${sold ? 'text-gray-500' : 'text-green-800 group-hover:text-green-700'}`}>
                          {listing.title}
                        </h3>
                        <span className={`text-2xl font-bold whitespace-nowrap ${sold ? 'text-gray-400 line-through' : 'text-green-600'}`}>
                          KSh {listing.price}
                        </span>
                      </div>

                      <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${sold ? 'text-gray-400' : 'text-gray-600'}`}>
                        {listing.description}
                      </p>

                      {/* Product Meta - REAL DATA */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={14} />
                          <span className={sold ? 'text-gray-400' : ''}>{listing.location || "Location not specified"}</span>
                        </div>
                        {hasPhone && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone size={14} />
                            <span className={sold ? 'text-gray-400' : ''}>{listing.contact_phone}</span>
                          </div>
                        )}
                        {hasEmail && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail size={14} />
                            <span className={`truncate ${sold ? 'text-gray-400' : ''}`}>{listing.contact_email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span className={sold ? 'text-gray-400' : ''}>Posted {formatDate(listing.created_at)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => !sold && showContactOptions(listing)}
                          disabled={sold}
                          className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-colors text-center flex items-center justify-center gap-1 ${sold
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                          <Phone size={14} />
                          {sold ? 'Sold Out' : 'Contact Seller'}
                        </button>
                        <button
                          onClick={() => !sold && toggleFavorite(listing.id)}
                          disabled={sold}
                          className={`px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 ${sold
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : isFavorite
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          <Heart size={14} className={isFavorite ? "fill-current" : ""} />
                          {isFavorite ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && listings.length === 0 && (
            <div className="text-center text-green-600">
              <p className="text-lg mb-4">No products available yet.</p>
              {isAuthenticated ? (
                <Link
                  href="/listing-form"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Be the first to list your products
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Join as a farmer to start selling
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      {/* Contact Modal */}
      {showContactModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Contact Seller</h3>

            <p className="text-gray-600 mb-4">How would you like to contact the seller?</p>

            <div className="space-y-3 mb-6">
              {selectedListing.contact_phone && (
                <button
                  onClick={() => {
                    contactByPhone(selectedListing.contact_phone);
                    setShowContactModal(false);
                  }}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <Phone size={18} />
                  Call {selectedListing.contact_phone}
                </button>
              )}

              {selectedListing.contact_email && (
                <button
                  onClick={() => {
                    contactByEmail(selectedListing.contact_email);
                    setShowContactModal(false);
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Mail size={18} />
                  Email {selectedListing.contact_email}
                </button>
              )}
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}