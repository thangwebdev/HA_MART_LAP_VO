import React, { useMemo } from 'react';
import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { VscClose } from 'react-icons/vsc';

function DrawerBase({
  anchor = 'left',
  open,
  onClose,
  paperStyle,
  contentHeight,
  contentStyle,
  title,
  children,
  zIndex = 2000,
  showHeader = true,
  ...props
}) {
  const paperStyleSelf = useMemo(() => {
    switch (anchor) {
      case 'top':
        return { borderRadius: '0 0 20px 20px' };
      case 'left':
        return { borderRadius: '0 20px 20px 0' };
      case 'right':
        return { borderRadius: '20px 0 0 20px' };
      default:
        return { borderRadius: '20px 20px 0 0' };
    }
  }, [anchor]);

  return (
    <Drawer
      ModalProps={{ sx: { zIndex: zIndex } }}
      PaperProps={{
        sx: { ...paperStyleSelf, ...paperStyle },
        className: 'hidden-scroll',
        ...props.PaperProps,
      }}
      anchor={anchor}
      open={open}
      onClose={onClose}
      {...props}
    >
      <Stack
        sx={{
          height: '100%',
          padding: '0 10px',
          position: 'relative',
          ...contentStyle,
        }}
      >
        {showHeader ? (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ height: '40px', borderBottom: '1px dashed #ccc' }}
            >
              <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
                {title}
              </Typography>
              <IconButton onClick={onClose}>
                <VscClose fontSize="16px" />
              </IconButton>
            </Stack>
            <Box
              sx={{
                height: contentHeight || 'calc(100% - 40px)',
                overflow: 'auto',
              }}
              className="custome-scrolly"
            >
              {children}
            </Box>
          </>
        ) : (
          <Box
            sx={{
              height: contentHeight || '100%',
              overflow: 'auto',
            }}
            className="custome-scrolly"
          >
            {children}
          </Box>
        )}
      </Stack>
    </Drawer>
  );
}

export default DrawerBase;
