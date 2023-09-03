import { Box } from '@mui/material';
import React from 'react';
import ButtonOption from '~/components/button/ButtonOption';
import { AiOutlineSetting } from 'react-icons/ai';
import { BsPrinter } from 'react-icons/bs';
import { RiFileUserLine, RiHistoryFill } from 'react-icons/ri';
import { GoLocation } from 'react-icons/go';

function MenuSettings() {
  return (
    <Box sx={{ width: '250px' }}>
      <ButtonOption startIcon={<AiOutlineSetting fontSize="14px" />}>
        Thiết lập cửa hàng
      </ButtonOption>
      <ButtonOption startIcon={<BsPrinter fontSize="14px" />}>
        Quản lý mẫu in
      </ButtonOption>
      <ButtonOption startIcon={<RiFileUserLine fontSize="14px" />}>
        Quản lý người dùng
      </ButtonOption>
      <ButtonOption startIcon={<GoLocation fontSize="14px" />}>
        Quản lý chi nhánh
      </ButtonOption>
      <ButtonOption startIcon={<RiHistoryFill fontSize="14px" />}>
        Lịch sử thao tác
      </ButtonOption>
    </Box>
  );
}

export default MenuSettings;
