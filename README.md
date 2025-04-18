# Gratis - Gratitude Journal App

A beautiful mobile gratitude journal app built with React Native and Expo.

## Overview

Gratis is a personal gratitude journal that helps you record moments of gratitude in your daily life. The app features a clean, modern design with a focus on simplicity and user experience.

## Features

- Daily gratitude entries with date tracking
- Prompt suggestions to inspire gratitude writing
- Monthly view to browse past entries
- Clean, minimalist UI with wavy background pattern
- Dark/light mode support (adapts to system preferences)
- Local-first data storage with Supabase sync capability

## Technology Stack

- **React Native**: Core UI framework
- **Expo**: Development platform
- **TypeScript**: Type safety
- **React Navigation**: Navigation between screens
- **AsyncStorage**: Local data persistence
- **Supabase**: Backend-as-a-Service (future integration)

## Component Library

Gratis is built on a custom tokenized design system with:

### Design Tokens
- Color palette with light/dark variants
- Typography scale (based on the golden ratio)
- Standardized spacing
- Common shapes and shadows

### Base Components
- Button
- Typography
- Card
- Input
- Background (with wave pattern)

### Composite Components
- EntryCard
- GratitudePrompt
- DatePicker

## Application Flow

1. **Splash Screen**: Initial loading screen
2. **Onboarding**: Welcome and introduction
3. **Home Screen**: Overview with recent entries and quick entry creation
4. **Entry Screen**: Create/edit gratitude entries with prompt suggestions
5. **Monthly View**: Calendar-based browsing of past entries

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gratis.git

# Navigate to the project directory
cd gratis

# Install dependencies
npm install

# Start the development server
npm start
```

## Project Structure

```
gratis/
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # UI components
│   │   ├── base/         # Base UI components
│   │   └── composite/    # Complex components
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # App screens
│   ├── services/         # API services
│   ├── storage/          # Local storage
│   ├── theme/            # Theme configuration
│   │   └── tokens/       # Design tokens
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
└── App.tsx               # Root component
```

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern mobile UI trends
- Built with React Native and Expo
