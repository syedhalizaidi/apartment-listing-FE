"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BASE_URL } from "../constants/constants";

// Utility function to extract numeric price from various formats
const extractPrice = (priceStr) => {
  if (!priceStr) return { price: 0, hasStartingFrom: false };
  const str = String(priceStr).toLowerCase();
  const hasStartingFrom = str.includes("starting from");
  const match = str.match(/\d+/);
  return {
    price: match ? parseInt(match[0], 10) : 0,
    hasStartingFrom,
  };
};

// Loading Skeleton Component
const ListingSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row animate-pulse">
    <div className="w-full md:w-96 lg:w-[400px] h-56 md:h-auto md:min-h-[320px] bg-gray-200 flex-shrink-0" />
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-8 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-6 bg-gray-200 rounded w-20" />
      </div>
    </div>
  </div>
);

export default function PropertyListings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [listings, setListings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match");

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/v1/listings/all`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch listings: ${res.status}`);
        }

        const data = await res.json();

        // API returns a direct array, not an object
        const listingsArray = Array.isArray(data) ? data : data.listings || [];

        // Helper function to parse images
        const parseImages = (imagesData) => {
          if (!imagesData) return [];

          if (Array.isArray(imagesData)) {
            const allUrls = [];
            imagesData.forEach((item) => {
              if (typeof item === "string") {
                try {
                  const parsed = JSON.parse(item);
                  if (Array.isArray(parsed)) {
                    allUrls.push(...parsed);
                  } else {
                    allUrls.push(item);
                  }
                } catch (e) {
                  const cleaned = item.trim();
                  if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
                    // Parse Python-style string array
                    // URLs can contain commas, so we need to match URLs properly
                    const inner = cleaned.slice(1, -1);

                    // Match URLs: http:// or https:// followed by characters until quote, space, or end
                    // This handles commas within URLs (like in query params)
                    const urlPattern = /https?:\/\/[^'"]+/g;
                    const urls = inner.match(urlPattern);

                    if (urls && urls.length > 0) {
                      // Clean up any remaining quotes and whitespace
                      const cleanedUrls = urls
                        .map((url) => {
                          let cleaned = url.trim();
                          // Remove quotes from start/end if present
                          cleaned = cleaned.replace(/^['"]+|['"]+$/g, "");
                          // Remove trailing commas if any
                          cleaned = cleaned.replace(/,\s*$/, "");
                          return cleaned;
                        })
                        .filter(
                          (url) =>
                            url.startsWith("http://") ||
                            url.startsWith("https://")
                        );

                      if (cleanedUrls.length > 0) {
                        allUrls.push(...cleanedUrls);
                      }
                    }
                  } else {
                    // Not a Python array, try to extract URLs directly
                    const urlPattern = /https?:\/\/[^'"]+/g;
                    const urlMatches = item.match(urlPattern);
                    if (urlMatches && urlMatches.length > 0) {
                      allUrls.push(...urlMatches);
                    } else if (
                      item.startsWith("http://") ||
                      item.startsWith("https://")
                    ) {
                      allUrls.push(item);
                    }
                  }
                }
              } else if (typeof item === "object" && item !== null) {
                allUrls.push(item);
              }
            });
            return allUrls;
          }

          if (typeof imagesData === "string") {
            try {
              const parsed = JSON.parse(imagesData);
              return Array.isArray(parsed) ? parsed : [imagesData];
            } catch (e) {
              // Extract URLs using regex (handles commas in URLs)
              const urlPattern = /https?:\/\/[^'"]+/g;
              const urlMatches = imagesData.match(urlPattern);
              return urlMatches || [];
            }
          }

          return [];
        };

        // Map API fields to component fields
        const mappedListings = listingsArray.map((listing) => {
          const images = parseImages(listing.images);
          const priceData = extractPrice(listing.price_usd);

          return {
            id: listing.id,
            title: listing.title || "",
            price: priceData.price,
            hasStartingFrom: priceData.hasStartingFrom,
            beds: listing.bedrooms || 0,
            baths: listing.bathrooms || 0,
            sqft: 0,
            image_urls: images,
            address: listing.title || "",
            neighborhood: listing.neighborhood || "",
            city: listing.city || "",
            petFriendly: listing.pet_dog === true,
            aiMatch: Math.round((listing._score || 0) * 100),
            availableNow: true,
            verified: true,
            listingStatus: null,
            priceDiscount: 0,
            commuteTime: 0,
            amenities: [],
            virtualTour: false,
            description: listing.description || "",
            url: listing.url || "",
          };
        });

        setListings(mappedListings);
        setTotalPages(1);
        setTotal(mappedListings.length);
      } catch (error) {
        setError(error.message || "Failed to load listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [currentPage]);

  const filteredListings = listings
    .filter((listing) => {
      if (filter === "all") return true;
      if (filter === "new") return listing.listingStatus === "New Today";
      if (filter === "available") return listing.availableNow;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.aiMatch - a.aiMatch;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "beds") return (b.beds || 0) - (a.beds || 0);
      return 0;
    });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const company = {
    name: "Premier Properties",
    phone: "(555) 234-5678",
    rating: 4.8,
    reviewCount: 287,
  };

  const avgRent =
    listings.length > 0
      ? Math.round(
          listings.reduce((sum, l) => sum + (l.price || 0), 0) / listings.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-4 shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <Link href="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
              🏢
            </div>
            <div className="text-lg md:text-xl font-bold text-gray-900">
              {company.name}
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-sm text-gray-600">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">{company.rating}</span>
              <span className="text-gray-400">({company.reviewCount})</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-12 md:py-20 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNFYyNGMwLTIuMjA5IDEuNzkxLTQgNC00czQgMS43OTEgNCA0djEwem0yNCAwYzAgMi4yMDktMS43OTEgNC00IDRzLTQtMS43OTEtNC00VjI0YzAtMi4yMDkgMS43OTEtNCA0LTRzNCAxLjc5MSA0IDR2MTB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Find Your Perfect Home
          </h1>
          <p className="text-lg md:text-xl opacity-95 mb-8 max-w-2xl">
            {loading ? (
              <span className="inline-block h-6 w-48 bg-white/20 rounded animate-pulse" />
            ) : (
              <>
                Discover <span className="font-semibold">{total}</span> premium
                properties
                {filteredListings.length !== total && (
                  <span>
                    {" "}
                    ({filteredListings.length} matching your filters)
                  </span>
                )}
              </>
            )}
          </p>
          <div className="grid grid-cols-3 gap-3 md:flex md:gap-6">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-xl border border-white/20">
              <div className="text-xs md:text-sm opacity-80 mb-1">Avg Rent</div>
              <div className="text-xl md:text-3xl font-bold">
                $
                {loading ? (
                  <span className="inline-block h-8 w-20 bg-white/20 rounded animate-pulse" />
                ) : (
                  avgRent.toLocaleString()
                )}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-xl border border-white/20">
              <div className="text-xs md:text-sm opacity-80 mb-1">
                Response Time
              </div>
              <div className="text-xl md:text-3xl font-bold">1 Hour</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-xl border border-white/20">
              <div className="text-xs md:text-sm opacity-80 mb-1">
                Pet Friendly
              </div>
              <div className="text-xl md:text-3xl font-bold">
                {loading ? (
                  <span className="inline-block h-8 w-12 bg-white/20 rounded animate-pulse" />
                ) : (
                  listings.filter((l) => l.petFriendly).length
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] md:top-[80px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm ${
                  filter === "all"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({listings.length})
              </button>
              <button
                onClick={() => setFilter("new")}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm ${
                  filter === "new"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                New Today
              </button>
              <button
                onClick={() => setFilter("available")}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm ${
                  filter === "available"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Available Now
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 font-medium bg-white text-gray-900 cursor-pointer transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="match">Best Match</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="beds">Most Bedrooms</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        {loading ? (
          <div className="flex flex-col gap-6">
            {[...Array(5)].map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Listings
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
            >
              Retry
            </button>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => setFilter("all")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                <Link
                  href={`/details/${listing.id}`}
                  className="flex flex-col md:flex-row"
                >
                  <div className="w-full md:w-96 lg:w-[400px] h-64 md:h-auto md:min-h-[320px] flex-shrink-0 relative overflow-hidden bg-gray-100">
                    <img
                      src={(() => {
                        const imgUrl = listing.image_urls?.[0];
                        if (!imgUrl)
                          return "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop";
                        // Add cache buster with listing ID to ensure unique URLs
                        const separator = imgUrl.includes("?") ? "&" : "?";
                        return `${imgUrl}${separator}_listing=${listing.id.substring(
                          0,
                          8
                        )}`;
                      })()}
                      alt={`${listing.title} - Property Image`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      key={`img-${listing.id}-${
                        listing.image_urls?.[0]?.substring(0, 30) || "default"
                      }-${listing.image_urls?.length || 0}`}
                      onError={(e) => {
                        const originalUrl = listing.image_urls?.[0];
                        if (originalUrl && !e.target.src.includes("unsplash")) {
                          e.target.src = originalUrl;
                        } else {
                          e.target.src =
                            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop";
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {listing.verified && (
                        <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                          ✓ Verified
                        </div>
                      )}
                      {listing.aiMatch > 0 && (
                        <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                          {listing.aiMatch}% Match
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 p-6 md:p-8 flex flex-col">
                    <div className="mb-4">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {listing.title}
                      </h2>
                      {listing.price > 0 && (
                        <div className="flex flex-wrap items-baseline gap-2 mb-3">
                          <div className="flex flex-col">
                            {listing.hasStartingFrom && (
                              <span className="text-sm text-gray-500 mt-1">
                                Starting from
                              </span>
                            )}
                            <span className="text-4xl md:text-5xl font-bold text-gray-900">
                              ${listing.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="text-base text-gray-600 mb-2">
                        {listing.city ? (
                          <>
                            {listing.city}
                            {listing.neighborhood && (
                              <span className="text-gray-400">
                                {" "}
                                • {listing.neighborhood}
                              </span>
                            )}
                          </>
                        ) : (
                          listing.title
                        )}
                      </div>
                      {listing.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                          {listing.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm md:text-base">
                      {listing.beds > 0 && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-lg">🛏️</span>
                          <span className="font-medium">
                            {listing.beds} beds
                          </span>
                        </div>
                      )}
                      {listing.baths > 0 && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-lg">🚿</span>
                          <span className="font-medium">
                            {listing.baths} baths
                          </span>
                        </div>
                      )}
                      {listing.city && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-lg">📍</span>
                          <span className="font-medium">{listing.city}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {listing.petFriendly && (
                        <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-100">
                          🐕 Pet Friendly
                        </span>
                      )}
                      {listing.availableNow && (
                        <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-100">
                          ✓ Available Now
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/40">
                        View Details
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && filteredListings.length > 0 && (
        <div className="bg-white border-t border-gray-200 px-4 md:px-10 py-4">
          <div className="max-w-7xl mx-auto flex justify-center items-center gap-4">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className={`px-6 py-2.5 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              ← Previous
            </button>
            <div className="text-sm font-semibold text-gray-700 px-4">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className={`px-6 py-2.5 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      {!loading && !error && (
        <div className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Need help finding a home?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our team is here to assist you 24/7. Get personalized
              recommendations and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${company.phone.replace(/\D/g, "")}`}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 text-base"
              >
                📞 Call {company.phone}
              </a>
              <button className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-gray-200 text-base">
                💬 Live Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
