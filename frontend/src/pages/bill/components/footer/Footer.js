import React, { memo } from 'react';
import { Button, Paper, Stack } from '@mui/material';
import ButtonBase from '~/components/button/ButtonBase';
import { useBillContext } from '../../Bill';
import DrawerPayment from '../Payment/DrawerPayment';
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from 'react-icons/md';
import useResponsive from '~/hooks/useResponsive';

function Footer() {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const smMatches = useResponsive({ matchKey: 'up', breakpoint: 'sm' });
  const { fullScreen, setFullScreen, openPayment, setOpenPayment } =
    useBillContext();

  const handleToggleFullScreen = () => {
    if (document.fullscreenEnabled) {
      if (fullScreen) {
        document.exitFullscreen();
        setFullScreen(false);
      } else {
        document.documentElement.requestFullscreen();
        setFullScreen(true);
      }
    }
  };
  const handleClickPayment = () => {
    setOpenPayment(true);
  };

  return (
    <Paper
      sx={{
        width: '100%',
        height: '42px',
        borderRadius: '4px',
        flexShrink: 0,
      }}
    >
      <DrawerPayment open={openPayment} onClose={() => setOpenPayment(false)} />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: '100%', height: '100%', padding: '0 5px' }}
      >
        <Stack direction="row" alignItems="center" spacing="10px">
          {mdMatches && (
            <ButtonBase
              onClick={handleToggleFullScreen}
              variant="contained"
              startIcon={
                fullScreen ? (
                  <MdOutlineZoomInMap size="14px" />
                ) : (
                  <MdOutlineZoomOutMap size="14px" />
                )
              }
            >
              {fullScreen ? 'Thu nhỏ' : 'Phóng to'}
            </ButtonBase>
          )}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing="5px"
          sx={{ width: smMatches ? 'auto' : '100%' }}
        >
          <Button
            variant="contained"
            sx={{
              width: smMatches ? '100px' : '50%',
              backgroundColor: 'whitish.gray',
              color: 'inherit',
              '&:hover': { backgroundColor: 'whitish.gray' },
            }}
          >
            In
          </Button>
          <Button
            onClick={handleClickPayment}
            variant="contained"
            sx={{ width: smMatches ? '200px' : '50%', color: '#fff' }}
          >
            Thanh toán {smMatches ? '(F9)' : ''}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default memo(Footer);
