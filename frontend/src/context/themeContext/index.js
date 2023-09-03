import React, { createContext, useContext, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';
import useLocalStorage from '../../hooks/useLocalStorage';
import themes from '~/utils/themes';

const ThemeContext = createContext();

function GlobalThemProvider({ children }) {
  const [themeId, setThemeId] = useLocalStorage('theme_id', 0);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        primary: (themes.find((item) => item.id === themeId) || theme[0])
          .colors,
        secondary: {
          main: '#6F49FD',
          second: '#8C6DFD',
          third: '#A992FE',
          four: '#C5B6FE',
          fif: '#E2DBFF',
        },
        thirdly: {
          main: '#D21312',
          second: '#ED2B2A',
          third: '#F48484',
          four: '#FF8E9E',
          fif: '#FFDEDE',
        },
        error: {
          main: '#EB5757',
        },
        darkmode: {
          darkBG: '#13131A',
          darkSecondary: '#1C1C24',
          softDark: '#22222C',
          darkSoft: '#24242C',
          darkStrokeColor: '#3A3A43',
          red: '#422C32',
        },
        neutral: {
          text1: '#171725',
          text2: '#4B5264',
          text3: '#808191',
          iconColor: '#A2A2A8',
          text4: '#B2B3BD',
        },
        whitish: {
          pureWhite: '#FFFFFF',
          whiteSoft: '#FCFBFF',
          graySoft: '#FCFCFC',
          gray: '#F0EEED',
          strockColor: '#F1F1F3',
          liteBackground: '#FCFCFD',
        },
      },
      typography: {
        h1: {
          color: '#171725',
        },
        h2: {
          color: '#171725',
        },
        h3: {
          color: '#171725',
        },
        h4: {
          color: '#171725',
        },
        h5: {
          color: '#171725',
        },
        h6: {
          color: '#171725',
        },
        subtitle1: {
          color: '#171725',
        },
        subtitle2: {
          color: '#171725',
        },
        body1: {
          color: '#171725',
        },
        body2: {
          color: '#171725',
        },
        fontFamily: ['Open Sans', 'sans-serif'].join(', '),
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1440,
        },
      },
    });
  }, [themeId]);

  return (
    <ThemeContext.Provider value={[themeId, setThemeId]}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useGlobalTheme = () => {
  const value = useContext(ThemeContext);
  if (!value)
    throw new Error('ThemeContext must be use inside ThemeContextProvider');
  return value;
};

export default GlobalThemProvider;
