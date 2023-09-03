import React, { useState } from 'react';
import {
  Collapse,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { BsCaretDown, BsCaretUp } from 'react-icons/bs';

function MenuItemBase({ Icon, text, subMenu, onClick, active, sx = {} }) {
  const [openSub, setOpenSub] = useState(false);

  const handleClick = (e) => {
    if (subMenu) {
      setOpenSub(!openSub);
    } else {
      onClick?.(e);
    }
  };

  return (
    <>
      <MenuItem
        onClick={handleClick}
        sx={{
          borderRadius: '4px',
          backgroundColor: active ? 'primary.opacity' : '',
          '&:hover': {
            backgroundColor: active ? 'primary.opacity' : '',
          },
          ...sx,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Stack direction="row" alignItems="center" spacing="10px">
            {Icon}
            {text && (
              <Typography
                sx={{
                  fontSize: '13px',
                }}
              >
                {text}
              </Typography>
            )}
          </Stack>
          {subMenu ? (
            <IconButton>
              {openSub ? <BsCaretUp size={14} /> : <BsCaretDown size={14} />}
            </IconButton>
          ) : null}
        </Stack>
      </MenuItem>
      {subMenu && (
        <Collapse
          in={openSub}
          timeout="auto"
          unmountOnExit
          sx={{ paddingLeft: '10px' }}
        >
          {subMenu}
        </Collapse>
      )}
    </>
  );
}

export default MenuItemBase;
