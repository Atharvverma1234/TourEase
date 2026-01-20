import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'tourease_theme';

export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or system preference
    const [theme, setTheme] = useState(() => {
        try {
            // Check localStorage first
            const saved = localStorage.getItem(THEME_STORAGE_KEY);
            if (saved && (saved === 'light' || saved === 'dark')) {
                return saved;
            }
        } catch (error) {
            console.error('Error loading theme from localStorage:', error);
        }

        // Fall back to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    });

    // Apply theme to document and save to localStorage
    useEffect(() => {
        try {
            // Apply dark class to document root
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            // Save to localStorage
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error) {
            console.error('Error applying theme:', error);
        }
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Only auto-switch if user hasn't manually set a preference
            // (i.e., if the current theme matches the old system preference)
            try {
                const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
                if (!savedTheme) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            } catch (error) {
                console.error('Error handling system preference change:', error);
            }
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
        // Fallback for older browsers
        else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const value = {
        theme,
        toggleTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export { ThemeContext };
