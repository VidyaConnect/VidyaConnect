# VidyaConnect Mobile Frontend

This folder contains the React Native mobile frontend for VidyaConnect using Expo Router.

## Setup

1. Install dependencies:

   ```bash
   cd mobile-front-end
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npm run start
   ```

## Project structure

- `src/app` - Expo Router pages and route layout
- `src/components` - reusable UI components
- `src/constants` - shared theme and route constants
- `src/context` - application context and auth state
- `src/features` - domain-specific feature modules
- `src/services` - HTTP client and backend service helpers
- `src/types` - shared TypeScript models
- `src/utils` - utility helpers

## Next steps

The mobile frontend is scaffolded for attendance, role-aware navigation, and backend integration. Next, implement attendance APIs, upload flows, and push notifications.
