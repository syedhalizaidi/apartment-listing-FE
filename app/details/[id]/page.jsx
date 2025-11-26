"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BASE_URL } from "../../constants/constants";

// Helper function to parse images
const parseImages = (imagesData) => {
  if (!imagesData) return [];
  
  if (Array.isArray(imagesData)) {
    const allUrls = [];
    imagesData.forEach((item) => {
      if (typeof item === 'string') {
        try {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed)) {
            allUrls.push(...parsed);
          } else {
            allUrls.push(item);
          }
        } catch (e) {
          const cleaned = item.trim();
          if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
            const inner = cleaned.slice(1, -1);
            const urls = inner.split(',').map(url => {
              const trimmed = url.trim();
              return trimmed.replace(/^['"]|['"]$/g, '');
            }).filter(url => url.startsWith('http://') || url.startsWith('https://'));
            if (urls.length > 0) {
              allUrls.push(...urls);
            }
          } else {
            const urlMatches = item.match(/https?:\/\/[^\s'",\[\]]+/g);
            if (urlMatches && urlMatches.length > 0) {
              allUrls.push(...urlMatches);
            } else if (item.startsWith('http://') || item.startsWith('https://')) {
              allUrls.push(item);
            }
          }
        }
      } else if (typeof item === 'object' && item !== null) {
        allUrls.push(item);
      }
    });
    return allUrls;
  }
  
  if (typeof imagesData === 'string') {
    try {
      const parsed = JSON.parse(imagesData);
      return Array.isArray(parsed) ? parsed : [imagesData];
    } catch (e) {
      const cleaned = imagesData.trim();
      if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
        const inner = cleaned.slice(1, -1);
        const urls = inner.split(',').map(url => {
          const trimmed = url.trim();
          return trimmed.replace(/^['"]|['"]$/g, '');
        }).filter(url => url.startsWith('http://') || url.startsWith('https://'));
        if (urls.length > 0) return urls;
      }
      const urlMatches = imagesData.match(/https?:\/\/[^\s'",\[\]]+/g);
      return urlMatches || [];
    }
  }
  
  return [];
};

// Loading Skeleton
const DetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white">
      <div className="w-full h-64 md:h-[600px] bg-gray-200 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
        <div className="h-12 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  </div>
);

export default function PropertyListing() {
  const params = useParams();
  const listingId = params?.id;
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allListingIds, setAllListingIds] = useState([]);
  const [similarPropertiesToShow, setSimilarPropertiesToShow] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const images = data?.property?.images || [];

  // Fetch all listing IDs for navigation
  useEffect(() => {
    const fetchAllIds = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/listings/all`);
        const data = await res.json();
        const listingsArray = Array.isArray(data) ? data : (data.listings || []);
        const ids = listingsArray.map((i) => i.id);
        setAllListingIds(ids);
      } catch (err) {
        console.error("Failed to load listing IDs", err);
      }
    };
    fetchAllIds();
  }, []);

  // Fetch similar properties
  useEffect(() => {
    if (!allListingIds.length || !listingId || !data) return;

    const fetchSimilar = async () => {
      setLoadingSimilar(true);
      try {
        const otherIds = allListingIds.filter((id) => id !== listingId);
        const shuffled = otherIds.sort(() => 0.5 - Math.random());
        const selectedIds = shuffled.slice(0, 3);

        const promises = selectedIds.map(async (id) => {
          try {
            const res = await fetch(`${BASE_URL}/api/v1/listings/details/${id}`);
            const listing = await res.json();
            const images = parseImages(listing.images);
            
            return {
              id: listing.id,
              name: listing.title || "Unknown Property",
              price: listing.price_usd || 0,
              beds: listing.bedrooms || 0,
              baths: listing.bathrooms || 0,
              address: listing.title || "",
              images: images,
            };
          } catch (err) {
            console.error(`Failed to load similar property ${id}:`, err);
            return null;
          }
        });

        const results = (await Promise.all(promises)).filter(Boolean);
        setSimilarPropertiesToShow(results);
      } catch (err) {
        console.error("Failed to load similar properties:", err);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilar();
  }, [allListingIds, listingId, data]);

  // Fetch main listing
  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/v1/listings/details/${listingId}`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch listing: ${res.status}`);
        }

        const listing = await res.json();
        const images = parseImages(listing.images);

        const mappedData = {
          property: {
            name: listing.title || "Unknown Property",
            price: listing.price_usd || 0,
            priceDiscount: 0,
            address: listing.title || "",
            beds: listing.bedrooms || 0,
            baths: listing.bathrooms || 0,
            sqft: 0,
            petFriendly: listing.pet_dog === true,
            aiMatch: Math.round((listing._score || 0) * 100),
            commuteTime: 0,
            verified: true,
            availableNow: true,
            images: images,
            virtualTour: false,
            description: listing.description || "",
            city: listing.city || "",
            state: listing.state || "",
            neighborhood: listing.neighborhood || "",
            url: listing.url || "",
          },
          company: {
            name: "Premier Properties",
            phone: "(555) 234-5678",
            rating: 4.8,
            reviewCount: 287,
          },
        };

        setData(mappedData);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
        setError(error.message || "Failed to load listing. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextProperty = () => {
    const index = allListingIds.indexOf(listingId);
    if (index >= 0 && index < allListingIds.length - 1) {
      router.push(`/details/${allListingIds[index + 1]}`);
    }
  };

  const goToPrevProperty = () => {
    const index = allListingIds.indexOf(listingId);
    if (index > 0) {
      router.push(`/details/${allListingIds[index - 1]}`);
    }
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error Loading Listing" : "Listing Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">{error || "The listing you're looking for doesn't exist."}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/listing')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse All Listings
            </button>
            {error && (
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop';
  const currentIndexNum = allListingIds.indexOf(listingId);
  const hasNext = currentIndexNum >= 0 && currentIndexNum < allListingIds.length - 1;
  const hasPrev = currentIndexNum > 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm px-4 md:px-10 py-4 shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/listing" className="flex items-center gap-3 md:gap-4 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
              🏢
            </div>
            <div className="text-lg md:text-xl font-bold text-gray-900">
              {data.company.name}
            </div>
          </Link>
          <Link
            href="/listing"
            className="text-sm md:text-base text-gray-600 hover:text-gray-900 font-medium transition"
          >
            ← Back to Listings
          </Link>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="bg-white">
        <div className="relative w-full h-64 md:h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={currentImage}
                alt={data.property.name}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/40 hover:bg-black/60 text-white text-2xl md:text-3xl shadow-lg backdrop-blur-sm transition-all duration-300"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/40 hover:bg-black/60 text-white text-2xl md:text-3xl shadow-lg backdrop-blur-sm transition-all duration-300"
                    aria-label="Next image"
                  >
                    →
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-gray-600">No images available</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            {hasPrev && (
              <button
                onClick={goToPrevProperty}
                className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-white transition text-sm"
              >
                ← Previous
              </button>
            )}
            {hasNext && (
              <button
                onClick={goToNextProperty}
                className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-white transition text-sm"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Property Info */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.property.name}
            </h1>
            {data.property.price > 0 && (
              <div className="flex flex-wrap items-baseline gap-3 mb-4">
                <span className="text-5xl md:text-6xl font-bold text-gray-900">
                  ${data.property.price.toLocaleString()}
                </span>
                <span className="text-2xl text-gray-500">/month</span>
              </div>
            )}
            <div className="text-lg md:text-xl text-gray-600 mb-6">
              {data.property.city && data.property.state ? (
                <>
                  {data.property.city}, {data.property.state}
                  {data.property.neighborhood && <span className="text-gray-400"> • {data.property.neighborhood}</span>}
                </>
              ) : (
                data.property.address
              )}
            </div>

            <div className="flex flex-wrap gap-6 mb-6 text-base md:text-lg">
              {data.property.beds > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-xl">🛏️</span>
                  <span className="font-medium">{data.property.beds} beds</span>
                </div>
              )}
              {data.property.baths > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-xl">🚿</span>
                  <span className="font-medium">{data.property.baths} baths</span>
                </div>
              )}
              {data.property.city && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-xl">📍</span>
                  <span className="font-medium">{data.property.city}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {data.property.petFriendly && (
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-100">
                  🐕 Pet Friendly
                </span>
              )}
              {data.property.availableNow && (
                <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold border border-green-100">
                  ✓ Available Now
                </span>
              )}
              {data.property.verified && (
                <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold border border-green-100">
                  ✓ Verified
                </span>
              )}
              {data.property.aiMatch > 0 && (
                <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold border border-indigo-100">
                  ⚡ {data.property.aiMatch}% Match
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {data.property.description && (
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8 border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                About This Property
              </h2>
              <div className="text-base md:text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                {data.property.description}
              </div>
            </div>
          )}

          {/* Similar Properties */}
          {similarPropertiesToShow.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Similar Properties
              </h2>
              {loadingSimilar ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarPropertiesToShow.map((prop) => {
                    const img = prop.images[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop';
                    return (
                      <div
                        key={prop.id}
                        onClick={() => router.push(`/details/${prop.id}`)}
                        className="cursor-pointer bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                      >
                        <div className="w-full h-48 md:h-56 relative overflow-hidden bg-gray-200">
                          <img
                            src={img}
                            alt={prop.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop';
                            }}
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                            {prop.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-3 line-clamp-1">
                            {prop.address}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-700">
                            <div className="flex gap-3">
                              {prop.beds > 0 && (
                                <span className="flex items-center gap-1">
                                  🛏 {prop.beds}
                                </span>
                              )}
                              {prop.baths > 0 && (
                                <span className="flex items-center gap-1">
                                  🚿 {prop.baths}
                                </span>
                              )}
                            </div>
                            {prop.price > 0 && (
                              <span className="font-bold text-gray-900">
                                ${prop.price.toLocaleString()}/mo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Interested in this property?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us for more information or to schedule a viewing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${data.company.phone.replace(/\D/g, '')}`}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 text-base"
            >
              📞 Call {data.company.phone}
            </a>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-gray-200 text-base">
              💬 Live Chat
            </button>
            {data.property.url && (
              <a
                href={data.property.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition text-base"
              >
                🌐 Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
