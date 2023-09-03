import React, { useState } from 'react';
import {
  IconButton,
  Paper,
  Stack,
  Typography,
  Collapse,
  Badge,
} from '@mui/material';
import { BsCaretDown, BsCaretUp } from 'react-icons/bs';

function FilterBox({ children, title, dot }) {
  const [open, setOpen] = useState(true);

  return (
    <Paper sx={{ padding: '10px' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
            {title}
          </Typography>
          {dot && (
            <Badge
              variant="dot"
              overlap="rectangular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  width: '6px',
                  height: '6px',
                  minWidth: 'unset',
                },
              }}
            />
          )}
        </Stack>
        <IconButton onClick={() => setOpen(!open)}>
          {open ? (
            <BsCaretUp fontSize="14px" />
          ) : (
            <BsCaretDown fontSize="14px" />
          )}
        </IconButton>
      </Stack>
      <Collapse in={open}>{children}</Collapse>
    </Paper>
  );
}

export default FilterBox;
