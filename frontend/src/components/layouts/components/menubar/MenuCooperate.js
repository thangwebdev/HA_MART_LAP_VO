import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import ButtonOption from '~/components/button/ButtonOption';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { RiUser2Line } from 'react-icons/ri';
import { MdOutlineLocalShipping } from 'react-icons/md';

function MenuCooperate() {
  return (
    <MenuCooperateWrapper>
      <ButtonOption primary startIcon={<HiOutlineUserGroup fontSize="16px" />}>
        Khách hàng
      </ButtonOption>
      <ButtonOption primary startIcon={<RiUser2Line fontSize="16px" />}>
        Nhà cung cấp
      </ButtonOption>
      <ButtonOption
        primary
        startIcon={<MdOutlineLocalShipping fontSize="16px" />}
      >
        Đối tác giao hàng
      </ButtonOption>
    </MenuCooperateWrapper>
  );
}

export default MenuCooperate;

const MenuCooperateWrapper = styled(Box)(({ theme }) => ({
  width: '250px',
  backgroundColor: theme.palette.primary.second,
}));
