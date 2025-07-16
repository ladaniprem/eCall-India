import React, { createContext, useState, useEffect } from 'react';
import { Moon, Sun, Car } from 'lucide-react';
// Removed import of missing useDarkMode hook

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isDrivingMode: boolean;
  ambientLight: number;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);
// useDarkMode hook moved to a separate file (useDarkMode.ts)

interface DarkModeProviderProps {
  children: React.ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDrivingMode, setIsDrivingMode] = useState(false);
  const [ambientLight, setAmbientLight] = useState(100); // Simulated lux value

  // Simulate ambient light sensor
  useEffect(() => {
    const interval = setInterval(() => {
      const currentHour = new Date().getHours();
      let simulatedLight;
      
      if (currentHour >= 6 && currentHour < 18) {
        // Daytime: 50-100 lux
        simulatedLight = 50 + Math.random() * 50;
      } else if (currentHour >= 18 && currentHour < 22) {
        // Evening: 10-50 lux
        simulatedLight = 10 + Math.random() * 40;
      } else {
        // Night: 0-20 lux
        simulatedLight = Math.random() * 20;
      }
      
      setAmbientLight(simulatedLight);
      
      // Auto-switch to dark mode when ambient light < 20 lux
      if (simulatedLight < 20 && !isDarkMode) {
        setIsDarkMode(true);
        setIsDrivingMode(true);
      } else if (simulatedLight > 50 && isDarkMode && isDrivingMode) {
        setIsDarkMode(false);
        setIsDrivingMode(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isDarkMode, isDrivingMode]);

  // Apply dark mode classes to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setIsDrivingMode(false); // Manual toggle disables auto-driving mode
  };

  return (
    <DarkModeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      isDrivingMode, 
      ambientLight 
    }}>
      {children}
    </DarkModeContext.Provider>
  );
};

import { useContext } from 'react';

export const DarkModeToggle: React.FC = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('DarkModeToggle must be used within a DarkModeProvider');
  }
  const { isDarkMode, toggleDarkMode, isDrivingMode, ambientLight } = context;

  return (
    <div className="flex items-center space-x-2">
      {/* Ambient light indicator */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {ambientLight.toFixed(0)} lux
      </div>
      
      {/* Driving mode indicator */}
      {isDrivingMode && (
        <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
          <Car className="w-3 h-3" />
          <span>Auto</span>
        </div>
      )}
      
      {/* Toggle button */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </div>
  );
};