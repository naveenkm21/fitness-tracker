# FitTrack AI - AI-Powered Fitness Tracking

A modern fitness tracking application built with Next.js 14, featuring AI-powered exercise detection, rep counting, and gamification features.

## Features

- 🤖 **AI Exercise Detection** - Advanced pose detection technology tracks your movements and counts reps automatically
- 📊 **Progress Tracking** - Detailed analytics and progress visualization
- 🏆 **XP & Leaderboards** - Earn XP for every rep, level up, and compete with friends
- 📹 **Tutorial Videos** - Learn proper form with AI-guided tutorial videos
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/naveenkm21/fitness-tracker.git
cd fitness-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Netlify

This project is configured for easy deployment on Netlify.

### Automatic Deployment

1. Push your code to GitHub
2. Go to [Netlify](https://www.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub account and select this repository
5. Netlify will automatically detect the settings from `netlify.toml`
6. Click "Deploy site"

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `.next` folder to Netlify

### Netlify Configuration

The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Next.js plugin: `@netlify/plugin-nextjs`
- Node version: 18

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── leaderboard/       # Leaderboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── tutorials/        # Tutorials page
│   └── workout/          # Workout page
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Other components
├── public/               # Static assets
└── lib/                  # Utility functions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT

## Author

naveenkm21

