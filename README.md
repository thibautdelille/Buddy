# Buddy - Find Your Perfect Dog 🐕

Buddy is a modern web application built with React, TypeScript, and Material-UI that helps users find their perfect canine companion. The app features a beautiful, responsive interface and powerful search capabilities.

![Buddy Logo](/public/logo.svg)

## Features

- **Advanced Search Filters**
  - Filter dogs by breed
  - Search by location (city and state)
  - Multiple location selection support
  - Real-time search results

- **Dog Profiles**
  - View detailed dog information
  - See dog's location and age
  - Beautiful card-based interface
  - High-quality dog images

- **Favorites System**
  - Save favorite dogs
  - Easily manage favorites list
  - Persistent favorites storage

- **Match System**
  - Get matched with compatible dogs
  - View detailed match information
  - Location-aware matching

- **Modern UI/UX**
  - Responsive design
  - Dark/Light mode support
  - Clean and intuitive interface
  - Custom typography with Google Fonts
  - Smooth animations and transitions

## Technology Stack

- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- React Query
- React Router
- Google Fonts (Inter & Pacifico)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/buddy.git
   cd buddy
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Development

- **Development mode:**
  ```bash
  npm run dev
  ```

- **Type checking:**
  ```bash
  npm run typecheck
  ```

- **Linting:**
  ```bash
  npm run lint
  ```

- **Building for production:**
  ```bash
  npm run build
  ```

## Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. The build output will be in the `dist` directory

3. Deploy the contents of the `dist` directory to your hosting provider:
   - For Netlify: Connect your repository and set the build command to `npm run build`
   - For Vercel: Import your project and it will automatically detect the correct settings
   - For other platforms: Serve the contents of the `dist` directory

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=your_api_url_here
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
