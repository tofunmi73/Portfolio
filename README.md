# Artist Portfolio

A modern, responsive web application showcasing an artist's portfolio with dynamic content management and elegant design.

## ✨ Features

- **Portfolio Gallery**: Dynamic artwork display with series organization and filtering
- **Exhibition Management**: Comprehensive exhibition tracking with press coverage
- **Artist Journal**: Blog-style content sharing insights and creative process
- **Process Documentation**: Behind-the-scenes look at studio practice and techniques
- **Responsive Design**: Optimized for all devices with modern UI/UX
- **Admin Dashboard**: Content management system for easy updates
- **Search & Filter**: Advanced filtering by medium, series, tags, and more
- **Image Optimization**: Next.js Image component for optimal performance

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: MongoDB
- **Image Handling**: Next.js Image optimization
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tofunmi73/artist-portfolio.git
   cd artist-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=your_database_name
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── portfolio/         # Portfolio pages
│   ├── exhibitions/       # Exhibition pages
│   ├── journal/           # Blog/journal pages
│   ├── process/           # Process documentation
│   └── admin/             # Admin dashboard
├── components/            # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   └── ...
├── lib/                   # Utility functions
│   ├── mongodb.ts         # Database connection
│   └── ...
├── public/                # Static assets
└── styles/                # Global styles
```

## 🎨 Key Pages

- **Home** (`/`) - Landing page with featured works
- **Portfolio** (`/portfolio`) - Complete artwork gallery
- **Exhibitions** (`/exhibitions`) - Past and current exhibitions
- **Journal** (`/journal`) - Artist blog and insights
- **Process** (`/process`) - Studio tour and creative process
- **Admin** (`/admin`) - Content management dashboard

## 🔧 API Routes

- `GET /api/artworks` - Fetch artworks with filtering
- `POST /api/artworks` - Create new artwork
- `PUT /api/artworks` - Update artwork
- `GET /api/exhibitions` - Fetch exhibitions
- `POST /api/exhibitions` - Create exhibition
- `PUT /api/exhibitions` - Update exhibition
- `GET /api/blog` - Fetch blog posts
- `POST /api/series/sync` - Sync series data

## 🎛️ Admin Features

- **Artwork Management**: Add, edit, and organize artworks
- **Exhibition Management**: Create and manage exhibition listings
- **Content Management**: Blog post creation and editing
- **Series Management**: Organize artworks into series
- **Data Synchronization**: Bulk update and sync operations

## 🔐 Environment Variables

Required environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/artist-portfolio
MONGODB_DB=artist_portfolio
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean
- AWS
- Google Cloud

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔄 Data Management

### MongoDB Collections

- **artworks**: Individual artwork pieces
- **series**: Artwork series/collections
- **exhibitions**: Exhibition information
- **blog**: Journal/blog posts
- **process**: Process documentation

### Sample Data Structure

```javascript
// Artwork
{
  _id: ObjectId,
  title: "Artwork Title",
  medium: "Oil on Canvas",
  dimensions: "24x36 inches",
  year: 2024,
  series: "Series Name",
  image: "/images/artwork.jpg",
  description: "Artwork description...",
  tags: ["abstract", "color"],
  featured: true,
  createdAt: Date,
  updatedAt: Date
}
```

## 🆘 Support

For support, please open an issue on GitHub or contact [tofunmi73@gmail.com](mailto:tofunmi73@gmail.com).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [MongoDB](https://www.mongodb.com/) for database solutions
- [Vercel](https://vercel.com/) for seamless deployment

---
