'use client';

import { useState } from 'react';
import { 
  Home as HomeIcon, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  Wifi, 
  Dog, 
  Phone, 
  Mail, 
  ExternalLink,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  Camera,
  CheckCircle
} from 'lucide-react';

export default function ApartmentDetail({ listing, onClose, onScheduleTour }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const getFeatureIcon = (feature) => {
    const featureLower = feature.toLowerCase();
    if (featureLower.includes('pet') || featureLower.includes('dog')) return <Dog className="w-5 h-5" />;
    if (featureLower.includes('parking') || featureLower.includes('garage')) return <Car className="w-5 h-5" />;
    if (featureLower.includes('wifi') || featureLower.includes('internet')) return <Wifi className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  const handleScheduleTour = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tourInfo = {
      email: formData.get('email'),
      phone: formData.get('phone'),
      preferredDate: formData.get('date'),
      preferredTime: formData.get('time'),
      message: formData.get('message')
    };
    
    onScheduleTour(listing, tourInfo);
    setShowContactForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Search
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Image Gallery */}
          <div className="mb-6">
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                <HomeIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-md">
                <span className="text-sm font-medium text-gray-900 dark:text-white">1 / 5</span>
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{listing.title}</h1>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">4.8 (24 reviews)</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>{listing.location}</span>
                </div>

                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                  {listing.price}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{listing.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{listing.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{listing.size}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Features & Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {listing.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {getFeatureIcon(feature)}
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {listing.description || `Beautiful ${listing.bedrooms} bedroom apartment in ${listing.location} with modern amenities. This spacious unit features ${listing.features.slice(0, 3).join(', ')} and is perfect for ${listing.bedrooms === 1 ? 'a single professional' : 'a family or roommates'}. Located in a prime area with easy access to public transportation, restaurants, and shopping.`}
                </p>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Availability</h3>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <span>Available: {listing.available}</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact & Schedule</h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Contact:</p>
                  <p className="font-medium text-gray-900 dark:text-white">{listing.contact}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Source:</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {listing.source}
                    </span>
                    <a 
                      href={listing.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule Tour
                  </button>
                  
                  <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Now
                  </button>
                  
                  <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Schedule a Tour</h3>
              <form onSubmit={handleScheduleTour} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="+81 90-1234-5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Date</label>
                  <input 
                    type="date" 
                    name="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Time</label>
                  <select 
                    name="time"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (9AM-12PM)</option>
                    <option value="afternoon">Afternoon (12PM-5PM)</option>
                    <option value="evening">Evening (5PM-8PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                  <textarea 
                    name="message"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Any specific questions or requests..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Schedule Tour
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
