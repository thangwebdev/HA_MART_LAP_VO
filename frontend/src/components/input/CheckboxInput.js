import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';

function CheckboxInput({ label, checked, onChange }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={onChange}
            size="small"
            sx={{ color: '#999' }}
          />
        }
        label={label}
        sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px' } }}
      />
    </Box>
  );
}

export default CheckboxInput;
