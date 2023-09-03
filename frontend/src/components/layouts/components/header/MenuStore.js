import React, { memo } from 'react';
import ButtonOption from '~/components/button/ButtonOption';
import { SlScreenDesktop } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import useResponsive from '~/hooks/useResponsive';

function MenuStore({ isAdmin = true }) {
  const navigate = useNavigate();
  const matches = useResponsive({ matchKey: 'up', breakpoint: 'md' });

  const handleNavigate = () => {
    if (isAdmin) {
      navigate('/bill');
    } else {
      navigate('/');
    }
  };

  return (
    <ButtonOption
      onClick={handleNavigate}
      style={{
        borderRadius: '4px',
        width: matches ? 'auto' : '42px',
        height: matches ? 'auto' : '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      endIcon={
        isAdmin ? (
          <SlScreenDesktop fontSize="14px" />
        ) : (
          <MdOutlineAdminPanelSettings fontSize="14px" />
        )
      }
    >
      {!!matches ? <>{isAdmin ? 'Bán hàng' : 'Quản trị'}</> : null}
    </ButtonOption>
  );
}

export default memo(MenuStore);
