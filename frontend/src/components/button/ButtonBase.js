import React from 'react';
import { LoadingButton } from '@mui/lab';

function ButtonBase({
  children,
  startIcon,
  endIcon,
  variant = 'contained',
  onClick = () => {},
  loading = false,
  disabled = false,
  sx = {},
  ...props
}) {
  return (
    <LoadingButton
      size="small"
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      sx={{
        textTransform: 'none',
        fontSize: '12px',
        fontWeight: 400,
        color: variant === 'contained' ? 'whitish.pureWhite' : '',
        ...sx,
      }}
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      {...props}
    >
      {children}
    </LoadingButton>
  );
}

export default ButtonBase;
