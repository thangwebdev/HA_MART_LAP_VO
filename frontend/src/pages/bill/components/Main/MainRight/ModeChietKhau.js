import { IconButton, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';

function ModeChietKhau({ onChange = () => {} }) {
  const [isPercent, setIsPercent] = useState(false);

  useEffect(() => {
    onChange({ isPercent });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPercent]);

  return (
    <Stack direction="row" alignItems="center">
      <IconButton
        onClick={() => setIsPercent(false)}
        size="small"
        sx={{
          fontSize: '10px',
          color: isPercent ? '' : 'whitish.pureWhite',
          borderRadius: '2px 0px 0px 2px',
          width: '32px',
          height: '22px',
          backgroundColor: isPercent ? 'whitish.gray' : 'primary.main',
          '&:hover': {
            backgroundColor: isPercent ? 'whitish.gray' : 'primary.main',
          },
        }}
      >
        VND
      </IconButton>
      <IconButton
        onClick={() => setIsPercent(true)}
        size="small"
        sx={{
          fontSize: '10px',
          borderRadius: '0px 2px 2px 0px',
          width: '32px',
          height: '22px',
          color: isPercent ? 'whitish.pureWhite' : '',
          backgroundColor: isPercent ? 'primary.main' : 'whitish.gray',
          '&:hover': {
            backgroundColor: isPercent ? 'primary.main' : 'whitish.gray',
          },
        }}
      >
        %
      </IconButton>
    </Stack>
  );
}

export default ModeChietKhau;
