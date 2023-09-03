import { Box, MenuItem, Typography } from '@mui/material';
import React from 'react';
import { SlLocationPin } from 'react-icons/sl';
import ButtonBase from '~/components/button/ButtonBase';
import { useBillContext } from '../../Bill';
import MenuBase from '~/components/menu/MenuBase';
import { useState } from 'react';
import { BsFillCaretDownFill } from 'react-icons/bs';

function SelectKho() {
  const { khos, khoSelected, setKhoSelected } = useBillContext();
  const [anchorMenu, setAnchorMenu] = useState();

  const handleCloseMenu = () => setAnchorMenu(null);
  const handleSelectKho = (kho) => {
    setKhoSelected(kho);
    handleCloseMenu();
  };

  return (
    <Box sx={{ marginLeft: 'auto' }}>
      <MenuBase
        open={!!anchorMenu}
        anchorEl={anchorMenu}
        handleClose={handleCloseMenu}
      >
        {khos?.map((kho) => (
          <MenuItem key={kho.ma_kho} onClick={() => handleSelectKho(kho)}>
            <Typography sx={{ fontSize: '13px' }}>{kho.ten_kho}</Typography>
          </MenuItem>
        ))}
      </MenuBase>
      <ButtonBase
        onClick={(e) => setAnchorMenu(e.currentTarget)}
        sx={{ height: '34px' }}
        startIcon={<SlLocationPin size="14px" />}
        endIcon={khos?.length > 1 ? <BsFillCaretDownFill size="14px" /> : null}
      >
        {khoSelected?.ten_kho}
      </ButtonBase>
    </Box>
  );
}

export default SelectKho;
