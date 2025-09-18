'use client';

import { useState } from 'react';
import { 
  Home as HomeIcon, 
  Search,  
  Shield, 
  Zap, 
  ArrowRight,
  Globe,
  MessageCircle,
} from 'lucide-react';

export default function Home() {
  const [isHovered, setIsHovered] = useState(null);

  const realEstateSites = [
    { name: 'SUUMO', description: 'リクルートの不動産ポータルサイト', color: 'bg-red-500' },
    { name: 'Homes.co.jp', description: '住まいの情報サイト', color: 'bg-blue-500' },
    { name: 'AtHome.co.jp', description: 'アットホームの賃貸情報', color: 'bg-green-500' },
    { name: 'Chintai.net', description: '賃貸物件検索サイト', color: 'bg-orange-500' },
    { name: 'Yahoo!不動産', description: 'Yahoo!不動産の賃貸情報', color: 'bg-purple-500' },
    { name: 'House.goo.ne.jp', description: 'gooハウスの賃貸情報', color: 'bg-indigo-500' },
    { name: 'MyHome.nifty.com', description: 'マイホームの賃貸情報', color: 'bg-pink-500' },
    { name: 'Sumaity.com', description: 'スマイティの賃貸情報', color: 'bg-teal-500' },
    { name: 'Door.ac', description: 'ドアの賃貸情報', color: 'bg-cyan-500' },
    { name: 'Apamanshop.com', description: 'アパマンショップの賃貸情報', color: 'bg-lime-500' },
    { name: 'Able.co.jp', description: 'エイブルの賃貸情報', color: 'bg-amber-500' },
    { name: 'Eheya.net', description: 'エヘヤの賃貸情報', color: 'bg-emerald-500' },
    { name: 'Leopalace21.com', description: 'レオパレス21の賃貸情報', color: 'bg-violet-500' },
    { name: 'Minimini.jp', description: 'ミニミニの賃貸情報', color: 'bg-rose-500' },
    { name: 'UR-net.go.jp', description: 'UR賃貸住宅の情報', color: 'bg-slate-500' }
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "AI-Powered Search",
      description: "Find your perfect apartment with intelligent recommendations across 15+ Japanese real estate sites"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Duplicate Detection",
      description: "No more seeing the same listing multiple times - we automatically remove duplicates"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Results",
      description: "Get instant updates from all major Japanese rental platforms"
    },
  ];

  const stats = [
    { number: "15+", label: "Real Estate Sites" },
    { number: "50K+", label: "Active Listings" },
    { number: "99%", label: "Duplicate Free" },
    { number: "24/7", label: "AI Assistant" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Apartment Finder</h1>
                <p className="text-sm text-gray-600">Your Personal Rental Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-blue-600"> Apartment</span>
              <br />
              in Japan
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Search across 15+ Japanese real estate sites with AI-powered recommendations. 
              No duplicates, no hassle - just the perfect apartment for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors flex items-center justify-center gap-2 text-lg font-semibold">
                <MessageCircle className="w-5 h-5" />
                Chat with AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Apartment Finder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;ve revolutionized apartment hunting in Japan with cutting-edge technology and comprehensive coverage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div className={`w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                  isHovered === index ? 'bg-blue-600 text-white' : 'text-blue-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Estate Sites Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Search Across Japan&apos;s Top Real Estate Sites
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We aggregate listings from all major Japanese rental platforms to give you the most comprehensive search experience.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {realEstateSites.map((site, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-12 h-12 ${site.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-center mb-2">{site.name}</h3>
                <p className="text-sm text-gray-600 text-center">{site.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find your perfect apartment in just 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tell Us What You Want</h3>
              <p className="text-gray-600">Describe your ideal apartment - location, budget, bedrooms, and any special requirements.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Searches Everywhere</h3>
              <p className="text-gray-600">Our AI searches across 15+ Japanese real estate sites and removes duplicates automatically.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Schedule Tours</h3>
              <p className="text-gray-600">Select your favorites and schedule tours directly through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Apartment?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have found their perfect home with Apartment Finder.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors text-lg font-semibold">
            <Search className="w-5 h-5" />
            Start Searching Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Apartment Finder</h3>
                  <p className="text-sm text-gray-400">Your Personal Rental Assistant</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>AI-Powered Search</li>
                <li>Duplicate Detection</li>
                <li>Tour Scheduling</li>
                <li>Smart Filters</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Real Estate Sites</h4>
              <ul className="space-y-2 text-gray-400">
                <li>SUUMO</li>
                <li>Homes.co.jp</li>
                <li>AtHome.co.jp</li>
                <li>Yahoo!不動産</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Apartment Finder. All rights reserved. Built with ❤️ for apartment hunters in Japan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
