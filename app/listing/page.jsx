"use client";

import { useState } from "react";
import Link from "next/link";

export default function PropertyListings() {
  const listings = [
    {
      id: 1,
      price: 3450,
      priceDiscount: 200,
      address: "125 Lawrence St, Brooklyn, NY 11201",
      beds: 2,
      baths: 2,
      sqft: 950,
      petFriendly: true,
      aiMatch: 96,
      commuteTime: 18,
      listingStatus: "NEW TODAY",
      verified: true,
      availableNow: true,
      photoCount: 24,
      virtualTour: true,
      icon: "🏙️",
      neighborhood: "Downtown Brooklyn",
      amenities: ["Pool", "Gym", "Parking"],
    },
    {
      id: 2,
      price: 2850,
      priceDiscount: 150,
      address: "340 Jay St, Brooklyn, NY 11201",
      beds: 1,
      baths: 1,
      sqft: 650,
      petFriendly: true,
      aiMatch: 92,
      commuteTime: 15,
      listingStatus: "NEW",
      verified: true,
      availableNow: true,
      photoCount: 18,
      virtualTour: true,
      icon: "🌆",
      neighborhood: "MetroTech",
      amenities: ["Gym", "Rooftop", "Concierge"],
    },
    {
      id: 3,
      price: 4200,
      priceDiscount: null,
      address: "85 Fleet St, Brooklyn, NY 11201",
      beds: 3,
      baths: 2,
      sqft: 1200,
      petFriendly: true,
      aiMatch: 89,
      commuteTime: 22,
      listingStatus: null,
      verified: true,
      availableNow: false,
      photoCount: 32,
      virtualTour: true,
      icon: "🏢",
      neighborhood: "DUMBO",
      amenities: ["Pool", "Gym", "Terrace", "Parking"],
    },
    {
      id: 4,
      price: 3100,
      priceDiscount: 100,
      address: "180 Montague St, Brooklyn, NY 11201",
      beds: 2,
      baths: 1,
      sqft: 850,
      petFriendly: false,
      aiMatch: 85,
      commuteTime: 20,
      listingStatus: "NEW TODAY",
      verified: true,
      availableNow: true,
      photoCount: 20,
      virtualTour: false,
      icon: "🌃",
      neighborhood: "Brooklyn Heights",
      amenities: ["Gym", "Laundry", "Doorman"],
    },
    {
      id: 5,
      price: 5500,
      priceDiscount: null,
      address: "1 Brooklyn Bridge Park, Brooklyn, NY 11201",
      beds: 3,
      baths: 2.5,
      sqft: 1500,
      petFriendly: true,
      aiMatch: 94,
      commuteTime: 25,
      listingStatus: null,
      verified: true,
      availableNow: true,
      photoCount: 40,
      virtualTour: true,
      icon: "🌉",
      neighborhood: "Brooklyn Bridge Park",
      amenities: ["Pool", "Gym", "Spa", "Parking", "Concierge"],
    },
    {
      id: 6,
      price: 2650,
      priceDiscount: 200,
      address: "255 Adams St, Brooklyn, NY 11201",
      beds: 1,
      baths: 1,
      sqft: 600,
      petFriendly: true,
      aiMatch: 88,
      commuteTime: 16,
      listingStatus: "NEW",
      verified: false,
      availableNow: true,
      photoCount: 15,
      virtualTour: false,
      icon: "🏘️",
      neighborhood: "Downtown Brooklyn",
      amenities: ["Gym", "Laundry"],
    },
  ];

  const company = {
    name: "Brooklyn Premier Properties",
    phone: "(555) 234-5678",
    rating: 4.8,
    reviewCount: 287,
  };

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match");

  const filteredListings = listings
    .filter((listing) => {
      if (filter === "all") return true;
      if (filter === "new") return listing.listingStatus;
      if (filter === "pet") return listing.petFriendly;
      if (filter === "available") return listing.availableNow;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.aiMatch - a.aiMatch;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "beds") return b.beds - a.beds;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 sm:px-6 lg:px-10 py-3 md:py-4 shadow-md sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-900 to-blue-500 rounded-lg flex items-center justify-center text-lg md:text-xl">
              🏢
            </div>
            <div className="text-base md:text-lg font-bold text-black">
              {company.name}
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
            <div className="text-xs md:text-sm text-gray-600 hidden md:block">
              {company.rating}★ ({company.reviewCount} reviews)
            </div>
            <button className="bg-orange-500 text-white px-5 py-2 md:px-8 md:py-3 rounded-lg font-semibold text-sm md:text-base shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition w-full sm:w-auto">
              Contact Us
            </button>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-br from-blue-900 to-blue-500 text-white py-8 md:py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            Find Your Perfect Brooklyn Home
          </h1>
          <p className="text-base md:text-xl opacity-90 mb-4 md:mb-6">
            {filteredListings.length} Premium Properties Available
          </p>
          <div className="grid grid-cols-3 gap-2 md:flex md:gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-lg">
              <div className="text-xs md:text-sm opacity-80">Avg Rent</div>
              <div className="text-lg md:text-2xl font-bold text-white">
                $
                {Math.round(
                  listings.reduce((sum, l) => sum + l.price, 0) /
                    listings.length
                ).toLocaleString()}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-lg">
              <div className="text-xs md:text-sm opacity-80">Response</div>
              <div className="text-lg md:text-2xl font-bold text-white">
                {"1 Hour"}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-lg">
              <div className="text-xs md:text-sm opacity-80">Pet Units</div>
              <div className="text-lg md:text-2xl font-bold text-white">
                {listings.filter((l) => l.petFriendly).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-[64px] md:top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 md:py-4">
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition whitespace-nowrap text-xs md:text-sm ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({listings.length})
            </button>
            <button
              onClick={() => setFilter("new")}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition whitespace-nowrap text-xs md:text-sm ${
                filter === "new"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              New Today
            </button>
            <button
              onClick={() => setFilter("pet")}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition whitespace-nowrap text-xs md:text-sm ${
                filter === "pet"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pet Friendly
            </button>
            <button
              onClick={() => setFilter("available")}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition whitespace-nowrap text-xs md:text-sm ${
                filter === "available"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Available Now
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3 mt-3 md:mt-0 md:absolute md:right-4 lg:right-10 md:top-1/2 md:-translate-y-1/2">
            <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 md:flex-none px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 font-medium bg-white text-black cursor-pointer transition hover:border-gray-400 text-xs md:text-sm"
            >
              <option value="match">Best Match</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="beds">Most Bedrooms</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <div className="flex flex-col gap-4 md:gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col md:flex-row"
            >
              <div className="w-full md:w-96 lg:w-[400px] h-56 md:h-auto md:min-h-[320px] flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white relative overflow-hidden">
                <div className="text-6xl md:text-7xl lg:text-8xl group-hover:scale-110 transition-transform duration-300">
                  {listing.icon}
                </div>
                <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-2">
                  {listing.verified && (
                    <div className="bg-green-500 text-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      ✓ Verified
                    </div>
                  )}
                  {listing.listingStatus && (
                    <div className="bg-yellow-400 text-gray-900 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      {listing.listingStatus}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                  <div className="flex justify-between items-center">
                    <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-bold">
                      {listing.photoCount} Photos
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-bold shadow-lg">
                      ⚡ {listing.aiMatch}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 md:p-6 flex flex-col">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                      <span className="text-3xl md:text-4xl font-bold text-black">
                        ${listing.price.toLocaleString()}
                      </span>
                      <span className="text-lg md:text-xl text-gray-500">
                        /mo
                      </span>
                      {listing.priceDiscount && (
                        <span className="bg-green-50 text-green-600 px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm font-semibold">
                          ${listing.priceDiscount} Off
                        </span>
                      )}
                    </div>

                    <div className="text-sm md:text-base text-gray-600 mb-1">
                      {listing.address}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                      {listing.neighborhood}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid md:grid-cols-4 lg:flex lg:gap-6 gap-3 mb-3 md:mb-4 text-sm md:text-base text-black">
                  <div className="flex items-center gap-2">
                    <span>🛏️</span>
                    <span className="font-medium">{listing.beds} beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🚿</span>
                    <span className="font-medium">{listing.baths} baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📐</span>
                    <span className="font-medium">{listing.sqft} sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🚇</span>
                    <span className="font-medium">
                      {listing.commuteTime} min
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                  {listing.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-4 md:mb-5">
                  {listing.petFriendly && (
                    <div className="bg-blue-50 text-blue-700 px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm font-semibold">
                      🐕 Pet Friendly
                    </div>
                  )}
                  {listing.virtualTour && (
                    <div className="bg-purple-50 text-purple-700 px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm font-semibold">
                      🎥 Virtual Tour
                    </div>
                  )}
                  {listing.availableNow && (
                    <div className="bg-green-50 text-green-700 px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm font-semibold">
                      ✓ Available Now
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-auto">
                  <Link href="/details" >
                    <button className="flex-1 bg-orange-500 text-white py-3 md:py-3.5 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-base hover:bg-orange-600 transition shadow-lg shadow-orange-500/30">
                      View Details
                    </button>
                  </Link>
                  <button className="sm:flex-1 md:flex-initial bg-blue-500 text-white py-3 md:py-3.5 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-base hover:bg-blue-600 transition whitespace-nowrap">
                    Schedule Tour
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredListings.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-black mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => setFilter("all")}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-bold text-black mb-1">
              Need help finding a home?
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Our team is here to assist you 24/7
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="bg-blue-500 text-white px-5 py-3 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-blue-600 transition text-sm md:text-base">
              📞 Call {company.phone}
            </button>
            <button className="bg-gray-100 text-gray-700 px-5 py-3 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-gray-200 transition text-sm md:text-base">
              💬 Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
