import React, { useEffect, useState } from 'react';
import { fetchWeather, fetchForecast } from '../services/weatherService';

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

    useEffect(() => {
        if (city) {
            Promise.all([
                fetchWeather(city),
                fetchForecast(city)
            ])
                .then(([weatherData, forecastData]) => {
                    setWeather(weatherData);
                    setForecast(forecastData);
                })
                .catch(console.error);
        }
    }, [city]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem('city') as HTMLInputElement;
        setCity(input.value);
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="city"
                        placeholder="Entrez une ville..."
                        className="flex-1 p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                        Rechercher
                    </button>
                </div>
            </form>

            {!weather ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Entrez une ville pour voir la météo</p>
                </div>
            ) : (
                <>
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold mb-2">{weather.name}</h2>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <img
                                src={getWeatherIcon(weather.weather[0].icon)}
                                alt={weather.weather[0].description}
                                className="w-16 h-16"
                            />
                            <p className="text-xl capitalize">{weather.weather[0].description}</p>
                        </div>
                        <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
                        <p className="text-gray-500 dark:text-gray-400">
                            Min: {Math.round(weather.main.temp_min)}°C | Max: {Math.round(weather.main.temp_max)}°C
                        </p>
                    </div>

                    {forecast && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-4">Prévisions pour les 5 prochaines heures :</h3>
                            <div className="space-y-3">
                                {forecast.list.slice(0, 5).map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        <span className="font-medium w-20">{formatTime(item.dt)}</span>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={getWeatherIcon(item.weather[0].icon)}
                                                alt={item.weather[0].description}
                                                className="w-8 h-8"
                                            />
                                            <span className="capitalize">{item.weather[0].description}</span>
                                        </div>
                                        <span className="font-semibold">{Math.round(item.main.temp)}°C</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
