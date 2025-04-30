import React from 'react';

interface SearchBarProps {
    onSearch: (city: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem('city') as HTMLInputElement;
        onSearch(input.value);
    };

    return (
        <div className="w-full max-w-md mx-auto mb-4">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 sm:p-6 rounded-xl shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-row gap-2">
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
            </div>
        </div>
    );
}; 