# Weather Dashboard

A responsive weather dashboard built with React and TypeScript. Search any city in the world to see current conditions, an hourly forecast for the next 24 hours, and a 7-day outlook. The main panel takes on the color of the actual sky, shifting with the weather and between day and night.

**Live demo:** _add your Vercel or Netlify link here_

![Screenshot](./screenshot.png)

## Features

- City search with live suggestions, debounced requests, and full keyboard navigation
- "Use my location" through the browser's Geolocation API
- Current temperature, feels-like, humidity, wind speed and direction, recent rainfall, sunrise and sunset
- Hourly forecast for the next 24 hours with precipitation chance
- 7-day forecast with temperature range bars plotted on a shared scale for the week
- Celsius and Fahrenheit toggle, which also switches wind and rain units
- Recent searches, selected city, and unit choice saved in local storage
- Sky colors that change with the weather and time of day
- Automatic light and dark mode
- Loading, empty, and error states with a retry action
- Accessible: semantic markup, ARIA combobox pattern, visible focus, and reduced-motion support

## Tech stack

- [React 19](https://react.dev/) with TypeScript
- [Vite](https://vite.dev/) for development and builds
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/) icons
- [Open-Meteo](https://open-meteo.com/) forecast and geocoding APIs, free and with no API key required

## Getting started

You need [Node.js](https://nodejs.org/) 20.19 or newer.

```bash
git clone https://github.com/<your-username>/weather-dashboard.git
cd weather-dashboard
npm install
npm run dev
```

Then open http://localhost:5173.

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Starts the dev server                |
| `npm run build`   | Type-checks and builds to `dist/`    |
| `npm run preview` | Serves the production build locally  |

## Project structure

```
src/
├── components/
│   ├── Conditions.tsx      Current details: humidity, wind, rain, sun times
│   ├── CurrentPanel.tsx    Sky panel with the current temperature
│   ├── DailyForecast.tsx   7-day list with range bars
│   ├── ErrorState.tsx
│   ├── HourlyStrip.tsx     Scrollable 24-hour forecast
│   ├── LoadingState.tsx
│   ├── SearchBar.tsx       City search combobox and location button
│   ├── UnitToggle.tsx
│   └── WeatherIcon.tsx
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useWeather.ts       Fetches the forecast and tracks loading and error state
├── lib/
│   ├── api.ts              Open-Meteo requests and response mapping
│   ├── format.ts           Date, time, and value formatting
│   ├── sky.ts              Sky color themes
│   └── weatherCodes.ts     WMO weather code labels
├── App.tsx
├── index.css
├── main.tsx
└── types.ts
```

## Deploying

**Vercel:** import the repository at [vercel.com/new](https://vercel.com/new). Vercel detects Vite automatically, so no configuration is needed.

**Netlify:** import the repository, set the build command to `npm run build` and the publish directory to `dist`.

## Credits

Weather data by [Open-Meteo](https://open-meteo.com/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
