# Apartment Finder - Your Personal Rental Assistant

A modern, AI-powered apartment search platform that aggregates listings from Japan's top real estate websites. Built with Next.js 15, React 19, and Tailwind CSS.

## 🌟 Features

### Chat-Based Search Experience
- **Conversational Interface**: Natural language apartment search through chat
- **AI Assistant**: Intelligent responses to help refine your search criteria
- **Real-time Recommendations**: Get personalized apartment suggestions

### Multi-Site Integration
Searches across 15+ Japanese real estate websites:
- **SUUMO** - リクルートの不動産ポータルサイト
- **Homes.co.jp** - 住まいの情報サイト
- **AtHome.co.jp** - アットホームの賃貸情報
- **Chintai.net** - 賃貸物件検索サイト
- **Yahoo!不動産** - Yahoo!不動産の賃貸情報
- **House.goo.ne.jp** - gooハウスの賃貸情報
- **MyHome.nifty.com** - マイホームの賃貸情報
- **Sumaity.com** - スマイティの賃貸情報
- **Door.ac** - ドアの賃貸情報
- **Apamanshop.com** - アパマンショップの賃貸情報
- **Able.co.jp** - エイブルの賃貸情報
- **Eheya.net** - エヘヤの賃貸情報
- **Leopalace21.com** - レオパレス21の賃貸情報
- **Minimini.jp** - ミニミニの賃貸情報
- **UR-net.go.jp** - UR賃貸住宅の情報

### Smart Features
- **Duplicate Detection**: Automatically removes duplicate listings across sites
- **Rental-Only Filtering**: Ensures only rental properties are shown
- **Advanced Search Filters**: Location, price range, bedrooms, amenities
- **Tour Scheduling**: Schedule apartment viewings directly through the platform
- **Favorites System**: Save and manage your favorite listings

### Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic dark/light theme switching
- **Real-time Search**: Instant results as you type
- **Interactive Maps**: Visual location-based search
- **Image Galleries**: High-quality property photos

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apartment-listing-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Usage

### Chat Interface
1. Start a conversation with the AI assistant
2. Describe your ideal apartment (e.g., "2-3 bedroom in Brooklyn under $6k")
3. Answer follow-up questions about preferences
4. Review personalized recommendations
5. Select apartments for tours
6. Schedule viewings with contact information

### Search Page
1. Use advanced filters to narrow down options
2. Browse listings in grid or list view
3. Click on apartments for detailed information
4. Select multiple apartments for comparison
5. Schedule tours for selected properties

## 🏗️ Project Structure

```
apartment-listing-frontend/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── ApartmentCard.js
│   │   ├── ApartmentDetail.js
│   │   └── SearchFilters.js
│   ├── utils/              # Utility functions
│   │   └── realEstateSites.js
│   ├── search/             # Search page
│   │   └── page.js
│   ├── globals.css         # Global styles
│   ├── layout.js           # Root layout
│   └── page.js             # Home page
├── public/                 # Static assets
├── package.json
└── README.md
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Type Safety**: JavaScript (ES6+)

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Real Estate Site APIs (when implemented)
SUUMO_API_KEY=your_suumo_api_key
HOMES_API_KEY=your_homes_api_key
ATHOME_API_KEY=your_athome_api_key
# ... other site API keys
```

### Customization
- **Colors**: Modify the color scheme in `tailwind.config.js`
- **Fonts**: Update font imports in `app/layout.js`
- **Real Estate Sites**: Add new sites in `app/utils/realEstateSites.js`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Japanese real estate websites for providing comprehensive listing data
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon set

## 📞 Support

For support, email support@apartmentfinder.com or join our Discord community.

---

**Built with ❤️ for apartment hunters in Japan**
