import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import ButtonOption from '~/components/button/ButtonOption';
import { TbFileInvoice, TbTruckReturn } from 'react-icons/tb';
import { TfiDropbox } from 'react-icons/tfi';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { RiShareForwardBoxLine } from 'react-icons/ri';

function MenuTransaction() {
  return (
    <MenuTransactionWrapper>
      <ButtonOption primary startIcon={<TbFileInvoice fontSize="16px" />}>
        Hóa đơn
      </ButtonOption>
      <ButtonOption primary startIcon={<TbTruckReturn fontSize="16px" />}>
        Trả hàng
      </ButtonOption>
      <ButtonOption primary startIcon={<TfiDropbox fontSize="16px" />}>
        Nhập hàng
      </ButtonOption>
      <ButtonOption
        primary
        startIcon={<RiShareForwardBoxLine fontSize="16px" />}
      >
        Trả hàng nhập
      </ButtonOption>
      <ButtonOption
        primary
        startIcon={<MdOutlineDeleteSweep fontSize="14px" />}
      >
        Xuất hủy
      </ButtonOption>
    </MenuTransactionWrapper>
  );
}

export default MenuTransaction;

const MenuTransactionWrapper = styled(Box)(({ theme }) => ({
  width: '250px',
  backgroundColor: theme.palette.primary.second,
}));
