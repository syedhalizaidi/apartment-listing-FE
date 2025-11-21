export default function PropertyListing() {
   const data = {
    property: {
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
      description:
        "Experience modern living in this stunning 2-bedroom apartment managed by Brooklyn Premier Properties. This sun-filled residence features floor-to-ceiling windows, an open-concept kitchen with premium appliances, and a private balcony with city views. Located in our luxury building with resort-style amenities.",
    },
    company: {
      name: "Brooklyn Premier Properties",
      phone: "(555) 234-5678",
      rating: 4.8,
      reviewCount: 287,
    },
    highlights: [
      { icon: "✨", text: "Renovated 2024" },
      { icon: "🌆", text: "City Views" },
      { icon: "🚇", text: "2 blocks to subway" },
      { icon: "🏋️", text: "Building gym & pool" },
      { icon: "🧺", text: "In-unit washer/dryer" },
      { icon: "❄️", text: "Central A/C & heat" },
    ],
    aiFeatures: [
      {
        title: "Commute Time",
        value: "18 min",
        subtitle: "Via A/C train to Midtown",
      },
      {
        title: "True Cost",
        value: "$3,695",
        subtitle: "Rent + utilities + parking",
      },
      {
        title: "Lifestyle Match",
        value: "96%",
        subtitle: "Based on your preferences",
      },
      { title: "Nearby Gyms", value: "8", subtitle: "Within 1 mile" },
    ],
    amenities: [
      { icon: "🏊", text: "Rooftop Pool" },
      { icon: "💪", text: "Fitness Center" },
      { icon: "🚗", text: "Parking Garage" },
      { icon: "👨‍💼", text: "24/7 Concierge" },
      { icon: "🐾", text: "Pet Spa" },
      { icon: "🌳", text: "Garden Terrace" },
    ],
    propertyStats: [
      { label: "Listed", value: "Today" },
      { label: "Views", value: "34 today" },
      { label: "Tours scheduled", value: "5 this week" },
      { label: "Response time", value: "Under 1 hour" },
    ],
    neighborhoodStats: [
      { label: "Walk Score", value: "98/100" },
      { label: "Transit Score", value: "95/100" },
      { label: "Safety Rating", value: "8.5/10" },
    ],
    similarProperties: [
      { price: 2850, beds: 1, baths: 1, address: "340 Jay St", icon: "🌆" },
      { price: 4200, beds: 3, baths: 2, address: "85 Fleet St", icon: "🏢" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
       <header className="bg-white px-4 md:px-10 py-3 shadow-md sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-900 to-blue-500 rounded-lg flex items-center justify-center text-lg md:text-xl">
            🏢
          </div>

          <div className="text-sm md:text-lg font-bold">
            {data.company.name}
          </div>
        </div>

        <button className="hidden md:block bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition">
          Schedule Tour 
        </button>

        <button className="md:hidden bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition text-sm">
          Tour 
        </button>
      </header>
 
      <div className="bg-white">
        <div className="h-[350px] md:h-[600px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white relative px-3">
          <div className="text-center">
            <div className="text-4xl md:text-6xl mb-4">🏙️</div>
            <div className="text-lg md:text-2xl font-semibold">
              Luxury {data.property.beds}BR Apartment - Downtown Brooklyn
            </div>
            <div className="text-sm md:text-base opacity-80 mt-2">
              {data.property.photoCount} Photos •{" "}
              {data.property.virtualTour && "3D Virtual Tour Available"}
            </div>
          </div>

          <div className="absolute top-4 left-4 flex flex-wrap gap-2 md:gap-3">
            {data.property.verified && (
              <div className="bg-green-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg">
                ✓ Verified
              </div>
            )}
            <div className="bg-yellow-400 text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg">
              {data.property.listingStatus}
            </div>
            {data.property.availableNow && (
              <div className="bg-white text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg">
                📅 Available Now
              </div>
            )}
          </div>
        </div>

       
        <div className="px-4 md:px-10 py-6 md:py-8 flex flex-col md:flex-row justify-between gap-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex flex-wrap items-baseline gap-3 mb-3">
              <span className="text-3xl md:text-5xl font-bold">
                ${data.property.price.toLocaleString()}
              </span>
              <span className="text-lg text-gray-500">/month</span>

              <span className="bg-green-50 text-green-600 px-2 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm font-semibold">
                ${data.property.priceDiscount} Off First Month
              </span>
            </div>

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

          <div className="flex flex-col gap-3 items-stretch md:items-end w-full md:w-auto">
            <button className="w-full md:w-auto bg-orange-500 text-white px-5 py-3 rounded-xl font-bold text-base md:text-lg shadow-xl hover:bg-orange-600 transition">
              Schedule Tour Today
            </button>

            <button className="w-full md:w-auto bg-white text-blue-500 px-5 py-3 rounded-xl font-semibold text-sm md:text-base border-2 border-blue-500 hover:bg-blue-50 transition">
              💬 Text Us
            </button>

            <div className="text-xs text-gray-500 text-center md:text-right">
              ✓ Instant response • Available 24/7
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

       
          <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm mb-6">
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
          </div>

          
          <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-5">
              Building Amenities
            </h2>

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

  
        <div className="space-y-6">
        
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
        </div>
      </div>
    </div>
  );
}
