import React, { useState } from "react";
import { MapPin, Phone, Mail, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ListingCard = ({ listing }) => {
  const [showContact, setShowContact] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleContact = () => setShowContact(!showContact);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-3xl shadow-lg overflow-hidden transition-shadow duration-300"
    >
      {/* Image */}
      {listing.image_url && (
        <div className="relative">
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-56 object-cover rounded-t-3xl"
          />
          <span className="absolute top-3 right-3 bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
            ${listing.price}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 truncate">{listing.title}</h3>

        {/* Description */}
        <p className="text-gray-600 text-sm">
          {expanded ? listing.description : listing.description?.slice(0, 100) + (listing.description?.length > 100 ? "..." : "")}
          {listing.description?.length > 100 && (
            <button
              onClick={toggleExpanded}
              className="text-green-600 ml-2 font-medium hover:underline"
            >
              {expanded ? "Show Less" : "Show More"}
            </button>
          )}
        </p>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin size={16} className="mr-2 text-green-600" />
          {listing.location}
        </div>

        {/* Contact Toggle */}
        <div className="mt-2">
          <button
            onClick={toggleContact}
            className="flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <Info size={16} className="mr-1" /> Contact Seller
          </button>

          <AnimatePresence>
            {showContact && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 p-3 bg-green-50 rounded-lg text-gray-700 space-y-1"
              >
                {listing.contact_phone && (
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-green-600" />
                    {listing.contact_phone}
                  </div>
                )}
                {listing.contact_email && (
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2 text-green-600" />
                    {listing.contact_email}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;