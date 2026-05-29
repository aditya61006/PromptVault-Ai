import { createContext, useContext } from 'react';

export const ThemeContext = createContext({ theme: 'dark' });

export const useThemeContext = () => useContext(ThemeContext);
