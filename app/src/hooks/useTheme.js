import { useState, useEffect, createContext, useContext } from 'react';

// Create context
const ThemeContext = createContext();

// Provider factory
export const createThemeProvider = () => {
  // Return the provider component
  const ThemeProviderComponent = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
      // Get saved preference from localStorage or use system preference
      const savedMode = localStorage.getItem('byldur-dark-mode');
      if (savedMode !== null) {
        return savedMode === 'true';
      }
      // Use system preference as default
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Apply theme changes whenever darkMode changes
    useEffect(() => {
      document.documentElement.classList.toggle('dark-mode', darkMode);
      localStorage.setItem('byldur-dark-mode', darkMode);
    }, [darkMode]);

    // Listen for system theme changes
    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        // Only update if the user hasn't explicitly set a preference
        if (localStorage.getItem('byldur-dark-mode') === null) {
          setDarkMode(e.matches);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }, []);

    // Toggle theme function
    const toggleDarkMode = () => {
      setDarkMode(prevMode => !prevMode);
    };

    // Set specific theme
    const setTheme = (isDark) => {
      setDarkMode(isDark);
    };

    const value = {
      darkMode,
      toggleDarkMode,
      setTheme
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
  };
  
  ThemeProviderComponent.displayName = 'ThemeProvider';
  return ThemeProviderComponent;
};

// Provider component for direct usage
export const ThemeProvider = createThemeProvider();

// Hook for accessing theme context
const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export { useTheme };
export default useTheme; 