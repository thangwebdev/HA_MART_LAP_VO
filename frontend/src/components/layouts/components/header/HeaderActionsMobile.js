import React, { useState } from 'react';
import { Stack } from '@mui/material';
import { SlEnvolope } from 'react-icons/sl';
import ButtonOption from '~/components/button/ButtonOption';
import MenuStore from './MenuStore';
import { FiMenu } from 'react-icons/fi';
import MenuMobile from '../menubar/MenuMobile';

function HeaderActionsMobile({ isAdmin }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <MenuMobile open={openMenu} onClose={() => setOpenMenu(false)}  />
      <Stack direction="row" gap="10px" alignItems="center">
        <MenuStore isAdmin={isAdmin} />
        <ButtonOption
          style={{ borderRadius: '4px', width: '42px', height: '42px' }}
          startIcon={<SlEnvolope fontSize="14px" />}
          notification
        />
        <ButtonOption
          style={{
            borderRadius: '4px',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          startIcon={<FiMenu fontSize="18px" />}
          onClick={() => {
            setOpenMenu(true);
          }}
        />
      </Stack>
    </>
  );
}

export default HeaderActionsMobile;
