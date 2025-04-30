const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeather = async (city: string) => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
  );
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données météo');
  }
  return response.json();
};

export const fetchForecast = async (city: string) => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
  );
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des prévisions météo');
  }
  return response.json();
};
