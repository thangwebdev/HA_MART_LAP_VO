import React from 'react';
import ModalBase from './ModalBase';
import { Box } from '@mui/material';
import ButtonBase from '../button/ButtonBase';
import { v4 } from 'uuid';

function ModalConfirm({
  children,
  open,
  title,
  handleClose = () => {},
  onConfirm,
}) {
  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      title={title}
      actions={[
        onConfirm ? (
          <ButtonBase
            key={v4()}
            onClick={() => {
              onConfirm();
              handleClose();
            }}
          >
            Đồng ý
          </ButtonBase>
        ) : null,
        <ButtonBase key={v4()} variant="outlined" onClick={handleClose}>
          Đóng
        </ButtonBase>,
      ]}
    >
      <Box
        sx={{
          width: '400px',
          maxWidth: '80vw',
          backgroundColor: 'whitish.pureWhite',
        }}
      >
        {children}
      </Box>
    </ModalBase>
  );
}

export default ModalConfirm;
