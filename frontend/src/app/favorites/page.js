"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Heart, Trash2, Eye, ShoppingCart, MapPin, Phone, Calendar, Star } from "lucide-react";

export default function Favorites() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Fetch user's favorites from localStorage (simulated)
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchFavorites = async () => {
      try {
        // Get favorite IDs from localStorage
        const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favoriteIds.length === 0) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        // Fetch all listings
        const res = await api.get("listings/");
        
        // Filter to only include favorited listings
        const userFavorites = res.data.filter(listing => 
          favoriteIds.includes(listing.id)
        );

        setFavorites(userFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const removeFromFavorites = (listingId) => {
    if (!confirm("Remove from favorites?")) return;

    try {
      // Remove from localStorage
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      const updatedFavorites = favoriteIds.filter(id => id !== listingId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      // Update state
      setFavorites(favorites.filter(fav => fav.id !== listingId));
      alert("Removed from favorites!");
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Error removing favorite. Please try again.");
    }
  };

  const clearAllFavorites = () => {
    if (!confirm("Clear all favorites?")) return;
    
    localStorage.setItem('favorites', '[]');
    setFavorites([]);
    alert("All favorites cleared!");
  };

  const contactSeller = (listing) => {
    alert(`Contact ${listing.contact_phone || '+254712345678'} about ${listing.title}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRandomLocation = () => {
    const locations = [
      "Nairobi, Kenya", "Mombasa, Kenya", "Kisumu, Kenya", "Nakuru, Kenya",
      "Eldoret, Kenya", "Thika, Kenya", "Malindi, Kenya", "Kitale, Kenya"
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getRandomContact = () => {
    const prefixes = ["+2547", "+2541"];
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return prefixes[Math.floor(Math.random() * prefixes.length)] + randomNumber.toString().substring(0, 8);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Please Login</h2>
            <p className="text-green-600">You need to be logged in to view your favorites.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalValue = favorites.reduce((sum, fav) => sum + fav.price, 0);
  const averagePrice = favorites.length > 0 ? totalValue / favorites.length : 0;
  const locations = [...new Set(favorites.map(fav => fav.location))];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Heart size={28} className="text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-green-800">My Favorites</h1>
          </div>
          <p className="text-green-600 text-lg">Your saved agricultural products</p>
        </div>

        {/* Favorites Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-green-600 mt-4">Loading your favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">No favorites yet</h3>
              <p className="text-green-600 mb-6">Start by browsing products and adding them to your favorites!</p>
              <button
                onClick={() => router.push("/")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header with Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-green-700">
                    Hello, {user?.name}!
                  </h2>
                  <p className="text-green-600">
                    You have {favorites.length} favorite {favorites.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button
                    onClick={clearAllFavorites}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Eye size={20} />
                    Browse More
                  </button>
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((listing) => {
                const location = getRandomLocation();
                const contact = getRandomContact();
                
                return (
                  <div key={listing.id} className="bg-white rounded-lg shadow-lg border border-green-100 overflow-hidden hover:shadow-xl transition-shadow group relative">
                    {/* Favorite Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={() => removeFromFavorites(listing.id)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg hover:scale-110"
                      >
                        <Heart size={20} className="fill-current" />
                      </button>
                    </div>

                    {/* Listing Image */}
                    <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden">
                      {listing.image_url ? (
                        <img 
                          src={listing.image_url} 
                          alt={listing.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center text-green-600">
                          <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Star size={24} className="fill-current" />
                          </div>
                          <p className="text-sm font-medium">Favorite Product</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    </div>

                    {/* Listing Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-green-800 truncate flex-1 mr-2 group-hover:text-green-700">
                          {listing.title}
                        </h3>
                        <span className="text-2xl font-bold text-green-600 whitespace-nowrap">
                          KSh {listing.price}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>

                      {/* Product Meta */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={14} />
                          <span>{location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone size={14} />
                          <span>{contact}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>{formatDate(listing.created_at)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => contactSeller(listing)}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingCart size={16} />
                          Contact Seller
                        </button>
                        <button
                          onClick={() => removeFromFavorites(listing.id)}
                          className="px-3 py-2 border border-red-600 text-red-600 rounded text-sm hover:bg-red-50 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Favorites Summary */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Favorites Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">{favorites.length}</div>
                  <div className="text-sm text-red-700">Total Favorites</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{totalValue.toLocaleString()}</div>
                  <div className="text-sm text-green-700">Total Value</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(averagePrice).toLocaleString()}</div>
                  <div className="text-sm text-blue-700">Average Price</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{locations.length}</div>
                  <div className="text-sm text-purple-700">Locations</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
