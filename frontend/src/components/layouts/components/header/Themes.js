import React, { useState } from 'react';
import { VscSymbolColor } from 'react-icons/vsc';
import ButtonOption from '~/components/button/ButtonOption';
import MenuBase from '~/components/menu/MenuBase';
import { Grid, Box } from '@mui/material';
import useResponsive from '~/hooks/useResponsive';
import themes from '~/utils/themes';
import { useGlobalTheme } from '~/context/themeContext';

function Themes({ renderButton }) {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const [themeId, setThemeId] = useGlobalTheme();
  const [anchor, setAnchor] = useState(null);

  const handleChangeTheme = (theme) => {
    setThemeId(theme.id);
    setAnchor(null);
  };

  return (
    <>
      <MenuBase
        anchorEl={anchor}
        open={!!anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        handleClose={() => setAnchor(null)}
      >
        <Box sx={{ padding: '5px' }}>
          <Box sx={{ width: mdMatches ? '80px' : '168px' }}>
            <Grid container spacing="5px">
              {themes.map((theme) => (
                <Grid key={theme.id} item xs={3}>
                  <Box
                    sx={{
                      width: '100%',
                      paddingTop: '100%',
                      backgroundColor: theme.colors.main,
                      cursor: 'pointer',
                      pointerEvents: themeId === theme.id ? 'none' : 'all',
                      borderRadius: themeId === theme.id ? '50%' : '2px',
                      '&:hover': { opacity: '0.9' },
                    }}
                    onClick={() => handleChangeTheme(theme)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </MenuBase>
      {renderButton && typeof renderButton === 'function' ? (
        renderButton((e) => setAnchor(e.currentTarget))
      ) : (
        <ButtonOption
          style={{
            borderRadius: '4px',
          }}
          endIcon={<VscSymbolColor size={14} />}
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          Chủ đề
        </ButtonOption>
      )}
    </>
  );
}

export default Themes;
