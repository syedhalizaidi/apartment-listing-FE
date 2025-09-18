// Japanese Real Estate Sites Integration
export const REAL_ESTATE_SITES = {
  SUUMO: {
    name: 'SUUMO',
    url: 'https://suumo.jp',
    color: 'red',
    description: 'リクルートの不動産ポータルサイト',
    apiEndpoint: '/api/suumo',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  HOMES: {
    name: 'Homes.co.jp',
    url: 'https://homes.co.jp',
    color: 'blue',
    description: '住まいの情報サイト',
    apiEndpoint: '/api/homes',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  ATHOME: {
    name: 'AtHome.co.jp',
    url: 'https://athome.co.jp',
    color: 'green',
    description: 'アットホームの賃貸情報',
    apiEndpoint: '/api/athome',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  CHINTAI: {
    name: 'Chintai.net',
    url: 'https://chintai.net',
    color: 'orange',
    description: '賃貸物件検索サイト',
    apiEndpoint: '/api/chintai',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  YAHOO: {
    name: 'Yahoo!不動産',
    url: 'https://realestate.yahoo.co.jp/rent',
    color: 'purple',
    description: 'Yahoo!不動産の賃貸情報',
    apiEndpoint: '/api/yahoo',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  HOUSE_GOO: {
    name: 'House.goo.ne.jp',
    url: 'https://house.goo.ne.jp/rent',
    color: 'indigo',
    description: 'gooハウスの賃貸情報',
    apiEndpoint: '/api/house-goo',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  MYHOME: {
    name: 'MyHome.nifty.com',
    url: 'https://myhome.nifty.com/rent',
    color: 'pink',
    description: 'マイホームの賃貸情報',
    apiEndpoint: '/api/myhome',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  SUMAITY: {
    name: 'Sumaity.com',
    url: 'https://sumaity.com',
    color: 'teal',
    description: 'スマイティの賃貸情報',
    apiEndpoint: '/api/sumaity',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  DOOR: {
    name: 'Door.ac',
    url: 'https://door.ac',
    color: 'cyan',
    description: 'ドアの賃貸情報',
    apiEndpoint: '/api/door',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  APAMANSHOP: {
    name: 'Apamanshop.com',
    url: 'https://www.apamanshop.com',
    color: 'lime',
    description: 'アパマンショップの賃貸情報',
    apiEndpoint: '/api/apamanshop',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  ABLE: {
    name: 'Able.co.jp',
    url: 'https://www.able.co.jp',
    color: 'amber',
    description: 'エイブルの賃貸情報',
    apiEndpoint: '/api/able',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  EHEYA: {
    name: 'Eheya.net',
    url: 'https://www.eheya.net',
    color: 'emerald',
    description: 'エヘヤの賃貸情報',
    apiEndpoint: '/api/eheya',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  LEOPALACE: {
    name: 'Leopalace21.com',
    url: 'https://www.leopalace21.com',
    color: 'violet',
    description: 'レオパレス21の賃貸情報',
    apiEndpoint: '/api/leopalace',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  MINIMINI: {
    name: 'Minimini.jp',
    url: 'https://minimini.jp',
    color: 'rose',
    description: 'ミニミニの賃貸情報',
    apiEndpoint: '/api/minimini',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  },
  UR_NET: {
    name: 'UR-net.go.jp',
    url: 'https://www.ur-net.go.jp/chintai',
    color: 'slate',
    description: 'UR賃貸住宅の情報',
    apiEndpoint: '/api/ur-net',
    searchParams: {
      rent: true,
      excludeSale: true
    }
  }
};

// Duplicate detection utility
export function detectDuplicates(listings) {
  const seen = new Map();
  const duplicates = [];
  const unique = [];

  listings.forEach(listing => {
    // Create a unique key based on location, price, and basic details
    const key = `${listing.location}-${listing.price}-${listing.bedrooms}BR-${listing.bathrooms}BA`;
    
    if (seen.has(key)) {
      duplicates.push({
        original: seen.get(key),
        duplicate: listing,
        key
      });
    } else {
      seen.set(key, listing);
      unique.push(listing);
    }
  });

  return { unique, duplicates };
}

// Filter for rental-only listings
export function filterRentalOnly(listings) {
  return listings.filter(listing => {
    // Check if the listing is explicitly marked as rental
    if (listing.type === 'rental' || listing.type === 'rent') {
      return true;
    }
    
    // Check if the listing has rental-specific keywords
    const rentalKeywords = ['賃貸', 'rent', 'rental', 'lease', '月額', 'monthly'];
    const titleLower = listing.title?.toLowerCase() || '';
    const descriptionLower = listing.description?.toLowerCase() || '';
    
    return rentalKeywords.some(keyword => 
      titleLower.includes(keyword) || descriptionLower.includes(keyword)
    );
  });
}

// Search across multiple sites
export async function searchMultipleSites(searchCriteria) {
  const searchPromises = Object.values(REAL_ESTATE_SITES).map(site => 
    searchSite(site, searchCriteria)
  );

  try {
    const results = await Promise.allSettled(searchPromises);
    const allListings = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);

    // Filter for rental-only listings
    const rentalListings = filterRentalOnly(allListings);
    
    // Remove duplicates
    const { unique } = detectDuplicates(rentalListings);
    
    return unique;
  } catch (error) {
    console.error('Error searching multiple sites:', error);
    return [];
  }
}

// Search individual site (mock implementation)
async function searchSite(site, criteria) {
  // This would be replaced with actual API calls to each site
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockListings = generateMockListings(site, criteria);
      resolve(mockListings);
    }, Math.random() * 1000 + 500);
  });
}

// Generate mock listings for demonstration
function generateMockListings(site, criteria) {
  const locations = ['DUMBO', 'Brooklyn Heights', 'Williamsburg', 'Park Slope', 'Cobble Hill'];
  const features = [
    ['High ceilings', 'Wood floors', 'Large kitchen'],
    ['Hardwood floors', 'Gourmet kitchen', 'Private terrace'],
    ['Exposed brick', 'Open kitchen', 'Balcony'],
    ['Modern design', 'Stainless appliances', 'City views'],
    ['Pet friendly', 'Parking available', 'Gym access']
  ];

  const numListings = Math.floor(Math.random() * 3) + 1;
  const listings = [];

  for (let i = 0; i < numListings; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const price = Math.floor(Math.random() * 200000) + 100000;
    const bedrooms = Math.floor(Math.random() * 3) + 1;
    const bathrooms = Math.floor(Math.random() * 2) + 1;
    const size = Math.floor(Math.random() * 30) + 50;
    const featureSet = features[Math.floor(Math.random() * features.length)];

    listings.push({
      id: `${site.name.toLowerCase()}-${Date.now()}-${i}`,
      title: `${bedrooms}BR Apartment in ${location}`,
      price: `¥${price.toLocaleString()}/month`,
      location: `${location}, Brooklyn`,
      bedrooms,
      bathrooms,
      size: `${size}㎡`,
      features: featureSet,
      images: [`/api/placeholder/400/300`],
      source: site.name,
      contact: `${location} Realty Co.`,
      available: '12/21/25',
      type: 'rental',
      url: `${site.url}/listing/${i}`,
      description: `Beautiful ${bedrooms} bedroom apartment in ${location} with modern amenities.`
    });
  }

  return listings;
}

// Format price for display
export function formatPrice(price) {
  if (typeof price === 'number') {
    return `¥${price.toLocaleString()}/month`;
  }
  return price;
}

// Validate search criteria
export function validateSearchCriteria(criteria) {
  const errors = [];

  if (criteria.minPrice && criteria.maxPrice) {
    if (parseInt(criteria.minPrice) > parseInt(criteria.maxPrice)) {
      errors.push('Minimum price cannot be greater than maximum price');
    }
  }

  if (criteria.moveDate) {
    const moveDate = new Date(criteria.moveDate);
    const today = new Date();
    if (moveDate < today) {
      errors.push('Move date cannot be in the past');
    }
  }

  return errors;
}






