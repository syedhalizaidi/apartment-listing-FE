"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BASE_URL } from "../../constants/constants";

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
            const inner = cleaned.slice(1, -1);
            const urlPattern = /https?:\/\/[^\s'"]+/g;
            const urls = inner.match(urlPattern);

            if (urls && urls.length > 0) {
              const cleanedUrls = urls
                .map((url) => {
                  let cleaned = url.trim();
                  cleaned = cleaned.replace(/^['"]+|['"]+$/g, "");
                  return cleaned;
                })
                .filter(
                  (url) =>
                    url.startsWith("http://") || url.startsWith("https://")
                );

              if (cleanedUrls.length > 0) {
                allUrls.push(...cleanedUrls);
              }
            }
          } else {
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
      const urlPattern = /https?:\/\/[^'"]+/g;
      const urlMatches = imagesData.match(urlPattern);
      return urlMatches || [];
    }
  }

  return [];
};

const REQUIRED_AMENITIES = [
  "parking",
  "garden",
  "wifi",
  "security",
  "heating",
  "cooling",
];

const getAmenityEmoji = (amenity) => {
  const a = amenity.toLowerCase();

  if (a.includes("pool")) return "🏊";
  if (a.includes("fitness") || a.includes("gym")) return "💪";
  if (a.includes("parking") || a.includes("garage")) return "🚗";
  if (a.includes("concierge") || a.includes("doorman")) return "👨‍💼";
  if (a.includes("pet")) return "🐾";
  if (a.includes("garden") || a.includes("terrace")) return "🌳";
  if (a.includes("laundry") || a.includes("washer")) return "🧺";
  if (a.includes("air") || a.includes("ac") || a.includes("cooling"))
    return "❄️";
  if (a.includes("heat") || a.includes("heating")) return "🔥";
  if (a.includes("elevator")) return "🛗";
  if (a.includes("balcony") || a.includes("patio")) return "🏡";
  if (a.includes("dishwasher")) return "🍽️";
  if (a.includes("storage")) return "📦";
  if (a.includes("security") || a.includes("alarm")) return "🔒";
  if (a.includes("wifi") || a.includes("internet")) return "📶";

  return "✨";
};

// Always show these items — even if missing from API
export const fixedAmenities = [
  { name: "Parking", emoji: "🚗" },
  { name: "Garden", emoji: "🌳" },
  { name: "Wifi", emoji: "📶" },
  { name: "Security", emoji: "🔒" },
  { name: "Heating", emoji: "🔥" },
  { name: "Cooling", emoji: "❄️" },
];

const renderAmenities = (amenities = []) => {
  const normalizedAmenities = amenities.map((a) => a.toLowerCase());

  // Start with the required ones
  const allAmenities = [
    ...new Set([...normalizedAmenities, ...REQUIRED_AMENITIES]),
  ];

  return allAmenities.map((amenity) => ({
    name: amenity.charAt(0).toUpperCase() + amenity.slice(1),
    emoji: getAmenityEmoji(amenity),
  }));
};

const getTimeSinceListed = (timestamp) => {
  if (!timestamp) return "Recently";

  const now = new Date();
  const listed = new Date(timestamp);
  const diffMs = now - listed;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

const DetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white">
      <div className="w-full h-64 md:h-[600px] bg-gray-200 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-8">
        <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
        <div className="h-8 md:h-12 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
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
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  const images = data?.property?.images || [];

  useEffect(() => {
    const fetchAllIds = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/listings/all`);
        const data = await res.json();
        const listingsArray = Array.isArray(data) ? data : data.listings || [];
        const ids = listingsArray.map((i) => i.id);
        setAllListingIds(ids);
      } catch (err) {
        // Silently fail
      }
    };
    fetchAllIds();
  }, []);

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
            const res = await fetch(
              `${BASE_URL}/api/v1/listings/details/${id}`
            );
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
            return null;
          }
        });

        const results = (await Promise.all(promises)).filter(Boolean);
        setSimilarPropertiesToShow(results);
      } catch (err) {
        // Silently fail
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilar();
  }, [allListingIds, listingId, data]);

  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${BASE_URL}/api/v1/listings/details/${listingId}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch listing: ${res.status}`);
        }

        const listing = await res.json();
        const images = parseImages(listing.images);

        // Generate consistent random numbers based on listing ID
        const generateSeed = (str) => {
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash = hash & hash;
          }
          return Math.abs(hash);
        };

        const seed = generateSeed(listingId);
        const random = (min, max, offset = 0) => {
          const x = Math.sin(seed + offset) * 10000;
          return Math.floor(min + (x - Math.floor(x)) * (max - min + 1));
        };

        const mappedData = {
          property: {
            name: listing.title || "Unknown Property",
            price: listing.price_usd || 0,
            address: listing.location || "",
            beds: listing.bedrooms || 1,
            baths: listing.bathrooms || 1,
            petFriendly:
              (listing.amenities &&
                listing.amenities.includes("Pet Friendly")) ||
              true,
            aiMatch: Math.round((listing._score || 0) * 100),
            images: images,
            description: listing.description || "",
            city: listing.city || "",
            state: listing.state || "",
            neighborhood: listing.neighborhood || "",
            amenities: listing.amenities || [],
            phone: listing.phone || "",
            timestamp: listing.timestamp || null,
            stats: {
              viewsToday: random(25, 50, 1),
              toursThisWeek: random(3, 8, 2),
              walkScore: random(85, 99, 3),
              transitScore: random(80, 98, 4),
              safetyRating: (random(80, 95, 5) / 10).toFixed(1),
              commuteTime: random(12, 25, 6),
              nearbyGyms: random(2, 7, 7),
            },
          },
        };

        setData(mappedData);
      } catch (error) {
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

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error Loading Listing" : "Listing Not Found"}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            {error || "The listing you're looking for doesn't exist."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => router.push("/listing")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Browse All Listings
            </button>
            {error && (
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition text-sm sm:text-base"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentImage =
    images[currentIndex] ||
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop";

  // Calculate previous and next property IDs
  const currentIndexInList = allListingIds.indexOf(listingId);
  const prevId =
    currentIndexInList > 0
      ? allListingIds[currentIndexInList - 1]
      : allListingIds[allListingIds.length - 1];
  const nextId =
    currentIndexInList < allListingIds.length - 1
      ? allListingIds[currentIndexInList + 1]
      : allListingIds[0];

  return (
    <div className="text-black min-h-screen bg-gray-50">
      <header className="bg-white px-4 md:px-10 py-3 md:py-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <Link href="/listing" className="flex items-center gap-2 md:gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="text-xl md:text-2xl leading-none">←</div>
              <div>Back to Listings</div>
            </div>
          </Link>

          {allListingIds.length > 0 && (
            <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push(`/details/${prevId}`)}
                className="cursor-pointer flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-semibold text-gray-700 text-sm md:text-base flex-1 sm:flex-initial"
              >
                <span>←</span>
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <button
                onClick={() => router.push(`/details/${nextId}`)}
                className="cursor-pointer flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-semibold text-gray-700 text-sm md:text-base flex-1 sm:flex-initial"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="bg-white">
        <div className="relative w-full h-64 sm:h-80 md:h-[500px] lg:h-[600px]">
          {images.length > 0 ? (
            <>
              <img
                src={currentImage}
                alt={data.property.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop";
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-black/40 hover:bg-black/60 text-white text-xl sm:text-2xl md:text-3xl backdrop-blur-sm transition cursor-pointer flex items-center justify-center"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-black/40 hover:bg-black/60 text-white text-xl sm:text-2xl md:text-3xl backdrop-blur-sm transition cursor-pointer flex items-center justify-center"
                    aria-label="Next image"
                  >
                    →
                  </button>

                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? "bg-white w-6 sm:w-8"
                            : "bg-white/50 w-1.5 sm:w-2"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white">
              <div className="text-center px-4">
                <div className="text-4xl sm:text-6xl mb-4">🏙️</div>
                <div className="text-lg sm:text-2xl">No images available</div>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 flex flex-col lg:flex-row justify-between items-start gap-6 border-b">
          <div className="flex-1 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{data.property.name}</h1>
            <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold">
                ${data.property.price.toLocaleString()}
              </span>
            </div>
            <div className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-5">
              {data.property.city && data.property.state
                ? `${data.property.city}, ${data.property.state}`
                : data.property.address}
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 mb-4 text-base sm:text-lg font-medium">
              {data.property.beds > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl">🛏️</span>
                  <span>{data.property.beds} beds</span>
                </div>
              )}
              {data.property.baths > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl">🚿</span>
                  <span>{data.property.baths} baths</span>
                </div>
              )}

              {data.property.petFriendly && (
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl">🐕</span>
                  <span>Pet friendly</span>
                </div>
              )}
            </div>
            {data.property.aiMatch > 0 && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold text-sm sm:text-base">
                <span>⚡</span>
                <span>{data.property.aiMatch}% Match for You</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 items-stretch lg:items-end w-full lg:w-auto">
            <button
              onClick={() =>
                (window.location.href = `tel:${data.property.phone}`)
              }
              className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl transition w-full lg:w-auto"
            >
              Contact to Owner
            </button>
            <button
              onClick={() => {
                window.location.href = "https://wa.me/14155238886";
              }}
              className="cursor-pointer bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-6 sm:px-8 md:px-12 py-3 rounded-xl font-semibold transition w-full lg:w-auto text-sm sm:text-base"
            >
              💬 Text Us
            </button>
            <div className="text-xs sm:text-sm text-gray-500 text-center lg:text-right">
              ✓ Instant response • Available 24/7
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">About This Home</h2>
              <div className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
                {data.property.description ||
                  "Experience modern living in this stunning apartment. This sun-filled residence features floor-to-ceiling windows, an open-concept kitchen with premium appliances, and a private balcony with city views."}
              </div>

              {/* Feature Points Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">✨</span>
                  <span>Renovated 2024</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">🌆</span>
                  <span>City Views</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">🚇</span>
                  <span>2 blocks to subway</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">🏋️</span>
                  <span>Building gym & pool</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">🧺</span>
                  <span>In-unit washer/dryer</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">❄️</span>
                  <span>Central A/C & heat</span>
                </div>
              </div>
            </div>

            {/* Personalized for You Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                🤖 Personalized for You
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                  <div className="text-blue-600 font-bold mb-1">
                    Commute Time
                  </div>
                  <div className="text-3xl font-bold">
                    {data.property.stats.commuteTime || 10} min
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Via public transit
                  </div>
                </div>
                {data.property.aiMatch > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                    <div className="text-blue-600 font-bold mb-1">
                      Lifestyle Match
                    </div>
                    <div className="text-3xl font-bold">
                      {data.property.aiMatch}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Based on your preferences
                    </div>
                  </div>
                )}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                  <div className="text-blue-600 font-bold mb-1">
                    Nearby Gyms
                  </div>
                  <div className="text-3xl font-bold">
                    {data.property.stats.nearbyGyms}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Within 1 mile
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">Building Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {renderAmenities(data.property.amenities || []).map(
                  (amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-xl">{amenity.emoji}</span>
                      <span>{amenity.name}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-20">
            {/* Premier Property Contact Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-4 sm:p-6 mb-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">🏢</span>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Premier Property</h3>
                  <div className="text-xs sm:text-sm text-blue-100">
                    4.8 ★ (267 reviews)
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() =>
                    (window.location.href = "https://wa.me/14155238886")
                  }
                  className="cursor-pointer w-full bg-white text-gray-900 py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span>📱</span>
                  <span className="hidden sm:inline">Text: +14155238886</span>
                  <span className="sm:hidden">Text Us</span>
                </button>
                <button
                  onClick={() => (window.location.href = "tel:+14155238886")}
                  className="cursor-pointer w-full bg-white text-gray-900 py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span>📞</span>
                  <span>Call Now</span>
                </button>
                <button
                  onClick={() =>
                    (window.location.href =
                      "mailto:mathieu@disruptivethoughts.co")
                  }
                  className="cursor-pointer w-full bg-white text-gray-900 py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span>✉️</span>
                  <span>Email Us</span>
                </button>
              </div>
            </div>

            {/* This Property Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">📊 This Property</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-semibold">
                    {getTimeSinceListed(data.property.timestamp)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Views</span>
                  <span className="font-semibold">
                    {data.property.stats.viewsToday} today
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Tours scheduled</span>
                  <span className="font-semibold">
                    {data.property.stats.toursThisWeek} this week
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Response time</span>
                  <span className="font-semibold">Under 1 hour</span>
                </div>
              </div>
            </div>

            {/* Neighborhood Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">📍 Neighborhood</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Walk Score</span>
                  <span className="font-semibold">
                    {data.property.stats.walkScore}/100
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Transit Score</span>
                  <span className="font-semibold">
                    {data.property.stats.transitScore}/100
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Safety Rating</span>
                  <span className="font-semibold">
                    {data.property.stats.safetyRating}/10
                  </span>
                </div>
              </div>
            </div>

            {loadingSimilar ? (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                  Other Available Units
                </h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-200 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : similarPropertiesToShow.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                  Other Available Units
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {similarPropertiesToShow.map((prop) => {
                    const img =
                      prop.images[0] ||
                      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop";
                    return (
                      <div
                        key={prop.id}
                        onClick={() => router.push(`/details/${prop.id}`)}
                        className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={img}
                            alt={prop.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base sm:text-lg">
                            ${prop.price.toLocaleString()}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 truncate">
                            {prop.beds} bed • {prop.baths} bath •{" "}
                            {prop.address.substring(0, 25)}...
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
