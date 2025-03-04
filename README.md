# HikeWise

HikeWise is a full-stack application designed to help hikers plan, organize, and track their hiking adventures. With a focus on user-friendliness and practical functionality, the app offers everything from weather integration to multilingual support.

<img width="1433" alt="Skärmavbild 2025-03-04 kl  19 13 25" src="https://github.com/user-attachments/assets/64eb0bb4-03d8-4980-a745-c2e51d7cbf8e" />

##

<img width="469" alt="Skärmavbild 2025-03-04 kl  19 14 41" src="https://github.com/user-attachments/assets/a168bfec-ac94-41ca-8d12-39501323d538" />
<img width="466" alt="Skärmavbild 2025-03-04 kl  19 14 49" src="https://github.com/user-attachments/assets/97607609-6f14-47d7-b7dc-59a0db0c1e5a" />
<img width="464" alt="Skärmavbild 2025-03-04 kl  19 14 57" src="https://github.com/user-attachments/assets/98a34ab9-0722-4455-ab49-2826d9e73f9e" />
<img width="450" alt="Skärmavbild 2025-03-04 kl  19 15 04" src="https://github.com/user-attachments/assets/95f7b2c9-22c1-4561-a603-ed9d4294eb5e" />
<img width="460" alt="Skärmavbild 2025-03-04 kl  19 15 10" src="https://github.com/user-attachments/assets/6172eb29-613c-447c-9b7a-8d4e2903fac6" />

## 

<img width="461" alt="Skärmavbild 2025-03-04 kl  19 15 36" src="https://github.com/user-attachments/assets/5ff49c59-7352-4519-b1bd-8576ea3df7cd" />
<img width="462" alt="Skärmavbild 2025-03-04 kl  19 16 15" src="https://github.com/user-attachments/assets/4c222a28-659a-41c0-ad70-a65236ad7b70" />
<img width="462" alt="Skärmavbild 2025-03-04 kl  19 16 32" src="https://github.com/user-attachments/assets/8681f22f-be5e-4650-9f5f-1652ca500e71" />
<img width="462" alt="Skärmavbild 2025-03-04 kl  19 15 43" src="https://github.com/user-attachments/assets/2c4889b0-5999-4dff-ae6e-d79f985c62c2" />

## 🎯 Vision

To simplify hiking planning by bringing all necessary tools into one place – from route planning and gear lists to weather reports and map visualization.

## ✨ Key Features

- **Smart Planning**: Create and organize hiking trips with maps and weather data
- **Gear Management**: Categorized overview of your hiking equipment
- **Multilingual**: Support for Swedish, English, French, Spanish, and Japanese
- **Customizable**: Tailor packing lists for each specific hike
- **Map Integration**: Visualize your routes with Google Maps
- **Weather Forecast**: Integrated weather information for better planning

## 🛠️ Technical Overview

Built with the following tech stack:
- **Frontend**: React 18, TypeScript, SCSS Modules
- **Backend**: Node.js, Express, MongoDB
- **External Services**: Google Maps, Weather API, Auth0

## 🎨 Design

The user interface is designed with a focus on:
- Responsiveness across all devices
- Intuitive navigation
- Clear information visualization
- Modern and clean design


# HikeWise for Developers
## How to run the project
### Prerequisites

1. Node.js (v18 or higher)
2. MongoDB Atlas account
3. Auth0 account
4. Google Maps API key
5. OpenWeather API key
6. Git

### Required Accounts & API Keys

1. **MongoDB Atlas**:
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string

2. **Auth0**:
   - Create a free account at [Auth0](https://auth0.com/)
   - Set up a new application
   - Get your domain and client ID
   - Configure allowed callback URLs in Auth0 dashboard:
     - http://localhost:5173
     - http://localhost:5173/callback

3. **Google Maps**:
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps JavaScript API
   - Get your API key
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
     - Geocoding API

4. **OpenWeather**:
   - Create a free account at [OpenWeather](https://openweathermap.org/)
   - Get your API key

### Environment Variables

#### Frontend (.env in client directory)
```
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### Backend (.env in server directory)
```
MONGO_URI=your_mongodb_connection_string
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your_session_secret
PORT=3001
```

### Installation Steps

1. Clone the repository:
2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd server
npm install
```

3. Create and configure .env files in both client and server directories using the templates above.

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend development server (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Common Issues and Solutions

1. **MongoDB Connection Issues**:
   - Ensure your IP address is whitelisted in MongoDB Atlas
   - Check that your connection string includes the correct password
   - Verify that your cluster is running

2. **Auth0 Authentication Problems**:
   - Verify callback URLs are correctly configured
   - Check that your application type is set to "Single Page Application"
   - Ensure all required Auth0 rules are enabled

3. **Google Maps Issues**:
   - Verify API key has correct permissions
   - Check if billing is enabled for your Google Cloud project
   - Ensure all required APIs are enabled

### Development Tools Recommended

- VS Code with the following extensions:
  - ESLint
  - Prettier
  - SCSS Formatter
  - TypeScript and JavaScript Language Features
  - MongoDB for VS Code

### Important URLs
- Main application: `/`
- Create Trail: `/create-trail`
- My Trails: `/trails`
- Gear Management: `/gear`
- Profile: `/my-profile`

### Database Information

The application uses MongoDB with the following main collections:
- `users`: User information and preferences
- `trails`: Hiking trail data
- `gear`: User gear inventory
- `favorites`: User's favorite trails

# Enjoy Hiking! 





