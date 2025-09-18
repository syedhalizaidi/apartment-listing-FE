'use client';

import { useState, useEffect } from 'react';
import { Search, Home as HomeIcon, Filter, Grid, List, MapPin } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';
import ApartmentCard from '../components/ApartmentCard';
import ApartmentDetail from '../components/ApartmentCard';
import { searchMultipleSites, detectDuplicates, filterRentalOnly } from '../utils/realEstateSites';

export default function SearchPage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedListings, setSelectedListings] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);

  // Load initial listings
  useEffect(() => {
    loadInitialListings();
  }, []);

  const loadInitialListings = async () => {
    setIsLoading(true);
    try {
      const results = await searchMultipleSites({});
      setListings(results);
      setFilteredListings(results);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = async (newFilters) => {
    setFilters(newFilters);
    setIsLoading(true);
    
    try {
      const results = await searchMultipleSites(newFilters);
      setListings(results);
      setFilteredListings(results);
    } catch (error) {
      console.error('Error filtering listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectListing = (listing) => {
    if (selectedListings.find(l => l.id === listing.id)) {
      setSelectedListings(prev => prev.filter(l => l.id !== listing.id));
    } else {
      setSelectedListings(prev => [...prev, listing]);
    }
  };

  const handleScheduleTour = (listing, tourInfo) => {
    console.log('Scheduling tour for:', listing.title, tourInfo);
    // Here you would typically send the tour request to your backend
    alert(`Tour scheduled for ${listing.title}! You'll be contacted soon.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Apartment Finder</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Search across Japan's top real estate sites</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredListings.length} apartments found
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Filters */}
        <SearchFilters onFiltersChange={handleFiltersChange} initialFilters={filters} />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Search Results
            </h2>
            {selectedListings.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedListings.length} selected
                </span>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Schedule Tours
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>Searching across 15+ real estate sites</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-gray-400">Searching apartments...</span>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredListings.map((listing) => (
              <ApartmentCard
                key={listing.id}
                listing={listing}
                onSelect={handleSelectListing}
                onRemove={(id) => setSelectedListings(prev => prev.filter(l => l.id !== id))}
                isSelected={selectedListings.some(l => l.id === listing.id)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredListings.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No apartments found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or expanding your search area.
            </p>
            <button
              onClick={() => setFilters({})}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Selected Listings Summary */}
        {selectedListings.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Selected for Tours ({selectedListings.length})
            </h3>
            <div className="space-y-3">
              {selectedListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{listing.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{listing.location} • {listing.price}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedListings(prev => prev.filter(l => l.id !== listing.id))}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowContactForm(true)}
              className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schedule Tours for Selected Apartments
            </button>
          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Schedule Apartment Tours</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const contactInfo = {
                email: formData.get('email'),
                phone: formData.get('phone'),
                preferredTime: formData.get('time')
              };
              
              selectedListings.forEach(listing => {
                handleScheduleTour(listing, contactInfo);
              });
              
              setShowContactForm(false);
              setSelectedListings([]);
            }} className="space-y-4">
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
                  Schedule Tours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
