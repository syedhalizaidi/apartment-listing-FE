'use client';

import { useState } from 'react';
import { Home as HomeIcon, MapPin, Calendar, Heart, ExternalLink, Star, Users, Car, Wifi, Dog } from 'lucide-react';

export default function ApartmentCard({ listing, onSelect, onRemove, isSelected = false }) {
  const [isLiked, setIsLiked] = useState(false);

  const getFeatureIcon = (feature) => {
    const featureLower = feature.toLowerCase();
    if (featureLower.includes('pet') || featureLower.includes('dog')) return <Dog className="w-4 h-4" />;
    if (featureLower.includes('parking') || featureLower.includes('garage')) return <Car className="w-4 h-4" />;
    if (featureLower.includes('wifi') || featureLower.includes('internet')) return <Wifi className="w-4 h-4" />;
    return null;
  };

  const getSourceColor = (source) => {
    const colors = {
      'SUUMO': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Homes.co.jp': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'AtHome.co.jp': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Yahoo!不動産': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Chintai.net': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'default': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[source] || colors.default;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'
    }`}>
      {/* Image Section */}
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-700 dark:to-gray-600 rounded-t-xl flex items-center justify-center">
              <HomeIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        </div>
        
        {/* Source Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(listing.source)}`}>
            {listing.source}
          </span>
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-md">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{listing.price}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-400">4.8</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{listing.location}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{listing.bedrooms}BR</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{listing.bathrooms}BA</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{listing.size}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {listing.features.slice(0, 4).map((feature, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              {getFeatureIcon(feature)}
              <span>{feature}</span>
            </span>
          ))}
          {listing.features.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{listing.features.length - 4} more
            </span>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Calendar className="w-4 h-4" />
          <span>Available: {listing.available}</span>
        </div>

        {/* Contact Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Contact: {listing.contact}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isSelected ? (
            <button
              onClick={() => onSelect(listing)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Select for Tour
            </button>
          ) : (
            <button
              onClick={() => onRemove(listing.id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Remove from Selection
            </button>
          )}
          
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
