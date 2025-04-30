import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { WeatherCard } from './components/WeatherCard';
import { Loader } from './components/Loader';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {isLoading ? (
        <div className=" bg-white dark:bg-black text-gray-900 dark:text-white ">
          <Loader />
        </div>
      ) : (
        <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8">
          <div className="max-w-md mx-auto">
            <WeatherCard />
          </div>
        </main>
      )}
    </ThemeProvider>
  );
}

export default App;
