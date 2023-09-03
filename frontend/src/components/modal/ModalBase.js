import * as React from 'react';
import Modal from '@mui/material/Modal';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { VscClose } from 'react-icons/vsc';

export default function ModalBase({
  children,
  open,
  handleClose,
  title,
  actions,
  width,
  ghost = false,
  sx = {},
  hideCloseIcon = false,
  ...props
}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        disableAutoFocus
        sx={sx}
        {...props}
      >
        <Box
          sx={{
            width: width || 'fit-content',
            minWidth: '200px',
            maxWidth: '95vw',
            minHeight: '50px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: ghost ? 'transparent' : 'background.paper',
            padding: '10px 0',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%', height: '40px', padding: '0 20px 10px 20px' }}
          >
            <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
              {title}
            </Typography>
            {!hideCloseIcon && (
              <IconButton onClick={handleClose}>
                <VscClose fontSize="18px" />
              </IconButton>
            )}
          </Stack>
          <Box
            className="custome-scrolly"
            sx={{
              height: 'auto',
              maxHeight: '80vh',
              overflow: 'auto',
              padding: '0 20px 10px 20px',
            }}
          >
            {children}
          </Box>
          {actions && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing="10px"
              sx={{ padding: '10px 10px 0 10px' }}
            >
              {actions}
            </Stack>
          )}
        </Box>
      </Modal>
    </div>
  );
}
