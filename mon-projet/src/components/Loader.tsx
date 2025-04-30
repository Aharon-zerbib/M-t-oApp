export const Loader = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="relative w-[70px] h-[70px]">
                <div className="absolute inset-0 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse transition-colors duration-300" />
                <div className="absolute inset-0 rounded-full bg-orange-500 dark:bg-orange-400 animate-ping opacity-75 transition-colors duration-300" />
                <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-orange-500 dark:border-orange-400 dark:border-t-transparent animate-spin transition-colors duration-300" />
            </div>
        </div>
    );
};
