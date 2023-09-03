import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import ButtonOption from '~/components/button/ButtonOption';
import { BsGrid3X3 } from 'react-icons/bs';
import { RiStore3Line } from 'react-icons/ri';
import { MdOutlineSell } from 'react-icons/md';

function MenuGoods() {
  return (
    <MenuGoodsWrapper>
      <ButtonOption primary startIcon={<BsGrid3X3 fontSize="14px" />}>
        Danh mục
      </ButtonOption>
      <ButtonOption primary startIcon={<MdOutlineSell fontSize="14px" />}>
        Thiết lập giá
      </ButtonOption>
      <ButtonOption primary startIcon={<RiStore3Line fontSize="14px" />}>
        Kiểm kho
      </ButtonOption>
    </MenuGoodsWrapper>
  );
}

export default MenuGoods;

const MenuGoodsWrapper = styled(Box)(({ theme }) => ({
  width: '250px',
  backgroundColor: theme.palette.primary.second,
}));
