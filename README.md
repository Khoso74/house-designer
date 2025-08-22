# AI House Designer 🏠

A complete web application for designing custom 3D house layouts using AI-powered procedural generation. Built with Next.js, Three.js, and modern web technologies.

## ✨ Features

### 🎨 User Interface
- **Modern, responsive design** with TailwindCSS
- **Smooth animations** using Framer Motion
- **Mobile-friendly** interface
- **Intuitive form** with real-time validation
- **Loading states** and error handling

### 🏗️ House Design
- **Custom plot sizes** (width x length or square)
- **House types**: Single story / Double story
- **Room configuration**: Bedrooms, bathrooms, kitchens
- **Style selection**: City (modern) / Village (traditional)
- **Extra notes** for additional requirements

### 🎮 3D Visualization
- **Interactive 3D viewer** using Three.js
- **Mouse controls**: Rotate, pan, zoom
- **Auto tour feature** with guided camera movement
- **Room-by-room exploration**
- **Furnished interiors** with appropriate furniture
- **Realistic lighting** and shadows

### 🔧 Technical Features
- **Procedural house generation** using mathematical algorithms
- **TypeScript** for type safety
- **API routes** for server-side processing
- **Error handling** and validation
- **Performance optimized** 3D rendering

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-house-designer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-house-designer/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── generate-house/ # House generation endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── House3DViewer.tsx  # 3D visualization component
│   └── HouseDesignForm.tsx # Design form component
├── services/              # Business logic
│   └── houseGenerator.ts  # House generation service
├── types/                 # TypeScript type definitions
│   └── house.ts          # House-related types
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
├── next.config.js         # Next.js configuration
└── README.md             # This file
```

## 🎯 Usage Guide

### 1. Design Your House
1. **Enter plot size** (e.g., "20x30" or "25")
2. **Select house type** (Single/Double story)
3. **Choose room counts** (Bedrooms, bathrooms, kitchens)
4. **Pick location style** (City/Village)
5. **Add extra notes** (optional)
6. **Click "Generate 3D House Design"**

### 2. Explore Your Design
- **Mouse controls**:
  - Left click + drag: Rotate view
  - Right click + drag: Pan view
  - Scroll: Zoom in/out
- **Auto Tour**: Click "Auto Tour" for guided exploration
- **Room exploration**: Navigate through each room
- **Style differences**: See modern vs traditional designs

### 3. Share & Download
- **Download**: Save your design (placeholder feature)
- **Share**: Share your design with others
- **New Design**: Start over with a new design

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### 3D Graphics
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - JavaScript runtime

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🏗️ House Generation Algorithm

The application uses a sophisticated procedural generation algorithm:

### 1. Plot Analysis
- Parses plot size input (width x length or square)
- Calculates optimal house footprint (80% of plot)
- Determines maximum dimensions

### 2. Room Layout
- **Living room**: Always present, larger size
- **Kitchens**: Based on user selection
- **Dining room**: Added if space allows
- **Bedrooms**: Arranged in grid pattern
- **Bathrooms**: Smaller rooms, efficient placement
- **Hallway**: Connects all rooms

### 3. Furniture Placement
- **City style**: Modern, minimalist furniture
- **Village style**: Traditional, warm-colored furniture
- **Room-specific**: Appropriate furniture for each room type
- **Proportional sizing**: Furniture scaled to room dimensions

### 4. Camera Tour
- **Exterior view**: Start from outside
- **Room-by-room**: Visit each room
- **Smooth transitions**: Animated camera movements
- **Duration control**: Configurable tour timing

## 🎨 Design System

### Color Schemes
- **Modern (City)**: Cool grays, whites, blues
- **Traditional (Village)**: Warm browns, creams, earth tones

### Room Types
- **Living**: Sofa, coffee table, TV cabinet
- **Bedroom**: Bed, wardrobe
- **Kitchen**: Counter, stove, refrigerator
- **Bathroom**: Toilet, sink
- **Dining**: Table, chairs

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy deployment
- **AWS/GCP**: Custom server deployment

## 🔧 Customization

### Adding New Room Types
1. Update `types/house.ts` with new room type
2. Modify `services/houseGenerator.ts` generation logic
3. Add furniture configurations
4. Update 3D viewer components

### Styling Changes
1. Modify `tailwind.config.js` for theme changes
2. Update `app/globals.css` for custom styles
3. Modify color schemes in `components/House3DViewer.tsx`

### API Enhancements
1. Add new endpoints in `app/api/`
2. Extend house generation service
3. Add validation and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Three.js** community for 3D graphics
- **Next.js** team for the amazing framework
- **TailwindCSS** for the utility-first approach
- **Framer Motion** for smooth animations

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Built with ❤️ using Next.js, Three.js, and TailwindCSS**


