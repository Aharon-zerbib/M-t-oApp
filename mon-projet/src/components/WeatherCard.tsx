import React, { useEffect, useState } from 'react';
import { fetchWeather, fetchForecast } from '../services/weatherService';
import { SearchBar } from './SearchBar';

interface ImportMetaEnv {
    VITE_WEATHER_API_KEY: string;
}

interface ImportMeta {
    env: ImportMetaEnv;
}

type WeatherData = {
    name: string;
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
};

type ForecastData = {
    list: {
        dt: number;
        main: {
            temp: number;
        };
        weather: {
            description: string;
            icon: string;
        }[];
    }[];
};

const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const WeatherCard = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
            const data = await response.json();
            setCity(data.name);
            setWeather(data);
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
            const forecastData = await forecastResponse.json();
            setForecast(forecastData);
        } catch (err) {
            setError("Impossible de récupérer la météo de votre position");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        setError("Impossible d'accéder à votre position");
                        setIsLoading(false);
                    }
                );
            } else {
                setError("La géolocalisation n'est pas supportée par votre navigateur");
                setIsLoading(false);
            }
        };

        getLocation();
    }, []);

    useEffect(() => {
        if (city) {
            setIsLoading(true);
            Promise.all([
                fetchWeather(city),
                fetchForecast(city)
            ])
                .then(([weatherData, forecastData]) => {
                    setWeather(weatherData);
                    setForecast(forecastData);
                    setError(null);
                })
                .catch((err) => {
                    setError("Impossible de récupérer la météo pour cette ville");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [city]);

    const handleSearch = (city: string) => {
        setCity(city);
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <SearchBar onSearch={handleSearch} />
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 sm:p-6 rounded-xl shadow-lg max-w-md mx-auto w-full">
                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500 dark:text-red-400">{error}</p>
                    </div>
                ) : !weather ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Entrez une ville pour voir la météo</p>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{weather.name}</h2>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
                                <img
                                    src={getWeatherIcon(weather.weather[0].icon)}
                                    alt={weather.weather[0].description}
                                    className="w-16 h-16"
                                />
                                <p className="text-lg sm:text-xl capitalize">{weather.weather[0].description}</p>
                            </div>
                            <p className="text-4xl sm:text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                Min: {Math.round(weather.main.temp_min)}°C | Max: {Math.round(weather.main.temp_max)}°C
                            </p>
                        </div>

                        {forecast && (
                            <div className="mt-6">
                                <h3 className="text-lg sm:text-xl font-semibold mb-4">Prévisions pour les 5 prochaines heures :</h3>
                                <div className="space-y-2 sm:space-y-3">
                                    {forecast.list.slice(0, 5).map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            <span className="font-medium text-sm sm:text-base">{formatTime(item.dt)}</span>
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={getWeatherIcon(item.weather[0].icon)}
                                                    alt={item.weather[0].description}
                                                    className="w-6 h-6 sm:w-8 sm:h-8"
                                                />
                                                <span className="text-sm sm:text-base capitalize">{item.weather[0].description}</span>
                                            </div>
                                            <span className="font-semibold text-sm sm:text-base">{Math.round(item.main.temp)}°C</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};
