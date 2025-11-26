"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import PremiumLoader from "../../components/loader/index";
import Link from "next/link";
import { BASE_URL } from "../../constants/constants";

export default function PropertyListing() {
  const params = useParams();
  const listingId = params?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [manualLoader, setManualLoader] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = data?.property?.images || [];
  const [allListingIds, setAllListingIds] = useState([]);
  const [similarPropertiesFull, setSimilarPropertiesFull] = useState([]);
  const [similarPropertiesToShow, setSimilarPropertiesToShow] = useState([]);

  const router = useRouter();
  useEffect(() => {
    if (!allListingIds.length || !listingId) return;

    const fetchSimilar = async () => {
      try {
        // Current listing exclude
        const otherIds = allListingIds.filter((id) => id !== listingId);

        // 7 random IDs
        const shuffled = otherIds.sort(() => 0.5 - Math.random());
        const selectedIds = shuffled.slice(0, 7);

        const promises = selectedIds.map(async (id) => {
          const res = await fetch(`${BASE_URL}/web-api/read-listing/${id}`);
          const json = await res.json();
          const listing = json.listing;
          return {
            id: listing.id,
            name: listing.title || listing.property_name || "Unknown Property",
            price: listing.price_yen_max || 0,
            beds: listing.floor_plan?.beds || 0,
            baths: listing.floor_plan?.baths || 0,
            address: listing.address || listing.location || "",
            images: listing.image_urls || [],
          };
        });

        const results = await Promise.all(promises);
        setSimilarPropertiesFull(results);

        // Randomly pick 2–3 to show
        const toShow = results.sort(() => 0.5 - Math.random()).slice(0, 3);
        setSimilarPropertiesToShow(toShow);
      } catch (err) {
        console.error("Failed to load similar properties:", err);
      }
    };

    fetchSimilar();
  }, [allListingIds, listingId]);
  useEffect(() => {
    const fetchAllIds = async () => {
      try {
        const res = await fetch(`${BASE_URL}/web-api/listings`);
        const json = await res.json();

        const ids = json.listings.map((i) => i.id);
        setAllListingIds(ids);
      } catch (err) {
        console.log("Failed to load listing IDs", err);
      }
    };

    fetchAllIds();
  }, []);
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

  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/web-api/read-listing/${listingId}`
        );

        const json = await res.json();
        const listing = json.listing;

        const mappedData = {
          property: {
            name: listing.title || listing.property_name || "Unknown Property",
            price: listing.price_yen_max || 0,
            priceDiscount: 0,
            address: listing.address || listing.location || "",
            beds: listing.floor_plan?.beds || 0,
            baths: listing.floor_plan?.baths || 0,
            sqft: listing.size_m2 || 0,
            petFriendly: false,
            aiMatch: 96,
            commuteTime: 18,
            verified: true,
            availableNow: true,
            images: listing.image_urls || [],
            virtualTour: !!listing.details_url,
            description: listing.extras?.description || "",
          },
          company: {
            name: listing.company?.name || " Premier Properties",
            phone: listing.company?.phone || "(555) 234-5678",
            rating: listing.company?.rating || 4.8,
            reviewCount: listing.company?.reviewCount || 287,
          },
          highlights: [],
          aiFeatures: [],
          amenities: [],
          propertyStats: [],
          neighborhoodStats: [],
          similarProperties: [],
        };

        setData(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (manualLoader) {
    return <PremiumLoader onFinish={() => setManualLoader(false)} />;
  }

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No listing found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white px-4 md:px-10 py-3 shadow-md sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-900 to-blue-500 rounded-lg flex items-center justify-center text-lg md:text-xl cursor-pointer">
              🏢
            </div>
          </Link>
          <div className="text-sm md:text-lg font-bold">
            {data.company.name}
          </div>
        </div>
      </header>
      <div className="bg-white">
        <div className="relative w-full h-64 md:h-[600px] flex items-center justify-center bg-gray-200 overflow-hidden">
          {images.length > 0 ? (
            images.map((img, index) => (
              <div
                key={index}
                className={`absolute w-full h-full bg-center bg-contain bg-no-repeat transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-700 to-purple-700" />
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-black/40 hover:bg-black/60 text-white text-xl sm:text-2xl md:text-3xl lg:text-3xl shadow-lg transition-all duration-300"
              >
                &#8592;
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-black/40 hover:bg-black/60 text-white text-xl sm:text-2xl md:text-3xl lg:text-3xl shadow-lg transition-all duration-300"
              >
                &#8594;
              </button>
            </>
          )}
        </div>

        <div className="px-4 md:px-10 py-6 md:py-8 flex flex-col md:flex-row justify-between gap-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end w-full md:w-auto gap-3">
              {/* Mobile Buttons */}
              <div className="flex justify-between md:hidden w-full">
                <button
                  onClick={goToPrevProperty}
                  disabled={allListingIds.indexOf(listingId) === 0}
                  className="bbg-gray-100 text-black px-4 py-2 rounded-lg font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Prev
                </button>
                <button
                  onClick={goToNextProperty}
                  disabled={
                    allListingIds.indexOf(listingId) ===
                    allListingIds.length - 1
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next
                </button>
              </div>

              {/* Desktop Buttons */}
              <button
                onClick={goToPrevProperty}
                disabled={allListingIds.indexOf(listingId) === 0}
                className="hidden md:block bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed relative -top-[23px]-left-[-32px]"
              >
                Prev Property
              </button>

              <button
                onClick={goToNextProperty}
                disabled={
                  allListingIds.indexOf(listingId) === allListingIds.length - 1
                }
                className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed relative -top-[20px] left-[984px]"
              >
                Next Property
              </button>

              <div className="text-xs text-gray-500 text-center mt-2 md:text-right md:relative md:-left-[787px]">
                ✓ Instant response • Available 24/7
              </div>
            </div>

            <div className="text-xl md:text-2xl font-bold mb-2">
              {data.property.name}
            </div>
            {data.property.price > 0 && (
              <div className="flex flex-wrap items-baseline gap-3 mb-3">
                <span className="text-3xl md:text-5xl font-bold">
                  ${data.property.price.toLocaleString()}
                </span>
                <span className="text-lg text-gray-500">/month</span>

                {data.property.priceDiscount > 0 && (
                  <span className="bg-green-50 text-green-600 px-2 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm font-semibold">
                    ${data.property.priceDiscount} Off First Month
                  </span>
                )}
              </div>
            )}

            <div className="text-sm md:text-lg text-gray-500 mb-4">
              {data.property.address}
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm md:text-lg font-medium">
                🛏️ {data.property.beds} beds
              </div>
              <div className="flex items-center gap-2 text-sm md:text-lg font-medium">
                🚿 {data.property.baths} baths
              </div>
              <div className="flex items-center gap-2 text-sm md:text-lg font-medium">
                📐 {data.property.sqft} sq ft
              </div>

              {data.property.petFriendly && (
                <div className="flex items-center gap-2 text-sm md:text-lg font-medium">
                  🐕 Pet friendly
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm">
              ⚡ {data.property.aiMatch}% Match • {data.property.commuteTime}{" "}
              min commute
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              About This Home
            </h2>

            <div className="text-sm md:text-base leading-relaxed text-gray-700">
              {data.property.description}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {data.highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-lg md:text-xl">{item.icon}</div>
                  <div className="text-sm md:text-base">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm mt-10 md:mt-14">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Similar Properties You May Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {similarPropertiesToShow.map((prop, i) => {
                const img =
                  prop.images[0] ||
                  "https://source.unsplash.com/400x300/?house";

                return (
                  <div
                    key={i}
                    onClick={() => router.push(`/details/${prop.id}`)}
                    className="cursor-pointer bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="w-full h-48 sm:h-56 md:h-60 lg:h-64 relative overflow-hidden">
                      <img
                        src={img}
                        alt={prop.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-4 md:p-5">
                      <div className="text-lg md:text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
                        {prop.name}
                      </div>

                      <div className="text-gray-500 text-sm md:text-base mb-3 line-clamp-1">
                        {prop.address}
                      </div>

                      <div className="flex items-center justify-between text-sm md:text-base text-gray-700">
                        <span className="flex items-center gap-1">
                          🛏 {prop.beds} beds
                        </span>
                        <span className="flex items-center gap-1">
                          🚿 {prop.baths} baths
                        </span>
                        <span className="font-semibold text-gray-900">
                          ${prop.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-5">
              🤖 Personalized for You
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.aiFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-indigo-100"
                >
                  <div className="font-bold text-sm md:text-base mb-2 text-blue-600">
                    {feature.title}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">
                    {feature.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {feature.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          <div>
            {/* <h2 className="text-xl md:text-2xl font-bold mb-5">
              Building Amenities
            </h2> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-lg md:text-xl">{item.icon}</div>
                  <div className="text-sm md:text-base">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-900 to-blue-500 text-white p-6 rounded-xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl">
                🏢
              </div>

              <div className="flex-1">
                <div className="text-lg font-bold">{data.company.name}</div>
                <div className="opacity-90 text-sm">
                  {data.company.rating}★ ({data.company.reviewCount} reviews)
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-white text-blue-900 py-3 px-4 rounded-lg font-semibold text-center cursor-pointer hover:bg-gray-100 transition text-sm md:text-base">
                📱 Text: {data.company.phone}
              </div>

              <div className="bg-white text-blue-900 py-3 px-4 rounded-lg font-semibold text-center cursor-pointer hover:bg-gray-100 transition text-sm md:text-base">
                📞 Call Now
              </div>

              <div className="bg-white text-blue-900 py-3 px-4 rounded-lg font-semibold text-center cursor-pointer hover:bg-gray-100 transition text-sm md:text-base">
                📧 Email Us
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">📊 This Property</h3>

            {data.propertyStats.map((stat, index) => (
              <div
                key={index}
                className={`flex justify-between py-3 ${
                  index !== data.propertyStats.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <span className="text-xs md:text-sm text-gray-500">
                  {stat.label}
                </span>
                <span className="text-sm md:text-base font-semibold">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">📍 Neighborhood</h3>

            {data.neighborhoodStats.map((stat, index) => (
              <div
                key={index}
                className={`flex justify-between py-3 ${
                  index !== data.neighborhoodStats.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <span className="text-xs md:text-sm text-gray-500">
                  {stat.label}
                </span>
                <span className="text-sm md:text-base font-semibold">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Other Available Units</h3>

            {data.similarProperties.map((prop, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl mb-3 cursor-pointer hover:bg-gray-100 transition"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl md:text-3xl">
                  {prop.icon}
                </div>

                <div className="flex-1">
                  <div className="text-base md:text-lg font-bold mb-1">
                    ${prop.price.toLocaleString()}/mo
                  </div>

                  <div className="text-xs text-gray-500">
                    {prop.beds} bed • {prop.baths} bath • {prop.address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
