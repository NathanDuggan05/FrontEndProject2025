# Music Explorer App

A modern, responsive music exploration application built with Ionic and Angular. This app allows users to discover artists, tracks, albums, and music events with an intuitive interface and smooth animations.

## Features

- **Artist Discovery**: Browse and search for artists with detailed information
- **Track Search**: Find songs with playcount and listener statistics
- **Album Browser**: Explore albums with cover art and artist information
- **Event Finder**: Discover music events near you with location-based search
- **Search History**: Keep track of your previous searches
- **Responsive Design**: Works seamlessly on mobile and desktop devices

## Technologies Used

- Angular 19.0.0
- Ionic Framework
- Capacitor 7.2.0
- Last.fm API Integration

## Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- npm (comes with Node.js)
- Ionic CLI: npm install -g @ionic/cli

### Installation

1. Clone the repository:
git clone [repository-url]
cd musicApp

2. Install dependencies:
npm install

3. Start the development server:
npm start

The application will be available at http://localhost:4200

### Building for Production

npm run build

## Project Structure

musicApp/

├── src/

│   ├── app/

│   │   ├── tab1/         # Artist discovery

│   │   ├── tab2/         # Search functionality

│   │   ├── tab3/         # Events feature

│   │   └── services/     # API services

│   ├── assets/           # Images and icons

│   ├── theme/            # Global styling

│   └── environments/     # Environment configurations

## Features in Detail

### Artist Discovery (Tab 1)
- View top artists
- Detailed artist biographies
- Top albums display
- Listener and playcount statistics

### Music Search (Tab 2)
- Search for artists, tracks, and albums
- Real-time search results
- Search history tracking
- Detailed music information

### Event Explorer (Tab 3)
- Location-based event search
- Event details and venue information
- Interactive event cards
- Nearby event discovery

## Styling

The app uses Ionic's theming system with custom animations and transitions for a modern, polished feel. Dark mode support is included through system preferences.
