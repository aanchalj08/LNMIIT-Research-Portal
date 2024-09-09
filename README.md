# Glide Guide: Effortless Itineraries for Every Traveler

## Overview

Glide Guide is a web application designed to revolutionize travel planning. It generates personalized travel itineraries based on user preferences, providing comprehensive trip details including activities, accommodations, dining options, and weather forecasts.

## Features

- Personalized itinerary generation
- Weather forecasting for trip duration
- Hotel and restaurant recommendations
- User authentication and profile management
- Itinerary saving functionality

## Technologies Used

### Frontend

- React.js
- React Router for navigation
- Axios for API requests
- CSS for styling

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose for database management
- JSON Web Tokens (JWT) for authentication

### APIs

- Google Maps API for location data and recommendations
- Visual Crossing Weather API for weather forecasts
- Gemini API for natural language processing and itinerary generation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies
3. Set up environment variables. Create a `.env` file in the backend directory and add the following:

- MONGODB_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- PLACES_API_KEY=your_google_maps_api_key
- WEATHER_API_KEY=your_visual_crossing_api_key
- GEMINI_API_KEY=your_gemini_api_key
- SMP_PASS=smp_password
- SMP_EMAIL=smp_email
- PORT

## Usage

1. Register for an account or log in
2. Enter your travel preferences (destination, dates, interests, etc.)
3. Receive a personalized itinerary
4. View and save your itinerary
5. Access saved itineraries from your profile
