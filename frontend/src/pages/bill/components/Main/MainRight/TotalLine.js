import React from 'react';
import { Stack, Typography } from '@mui/material';

function TotalLine({ text, length, total }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing="10px">
        <Typography sx={{ fontSize: '13px' }}>{text}:</Typography>
        {!!length && (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: '18px',
              height: '18px',
              backgroundColor: 'primary.fif',
              // backgroundColor: 'whitish.gray',
              borderRadius: '50%',
            }}
          >
            <Typography sx={{ fontSize: '12px' }}>{length}</Typography>
          </Stack>
        )}
      </Stack>
      <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
        {total}
      </Typography>
    </Stack>
  );
}

export default TotalLine;
