import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import ButtonOption from '~/components/button/ButtonOption';
import { BiLineChart } from 'react-icons/bi';
import { BsBarChart, BsBoxSeam } from 'react-icons/bs';
import { MdOutlineSell } from 'react-icons/md';
import { HiOutlineUserGroup, HiOutlineUsers } from 'react-icons/hi';
import { RiUser2Line } from 'react-icons/ri';
import { AiOutlineFundProjectionScreen } from 'react-icons/ai';

function MenuReport() {
  return (
    <MenuReportWrapper>
      <ButtonOption primary startIcon={<BsBarChart fontSize="16px" />}>
        Cuối ngày
      </ButtonOption>
      <ButtonOption primary startIcon={<MdOutlineSell fontSize="16px" />}>
        Bán hàng
      </ButtonOption>
      <ButtonOption primary startIcon={<BsBoxSeam fontSize="16px" />}>
        Hàng hóa
      </ButtonOption>
      <ButtonOption primary startIcon={<HiOutlineUserGroup fontSize="16px" />}>
        Khách hàng
      </ButtonOption>
      <ButtonOption primary startIcon={<RiUser2Line fontSize="16px" />}>
        Nhà cung cấp
      </ButtonOption>
      <ButtonOption primary startIcon={<HiOutlineUsers fontSize="16px" />}>
        Nhân viên
      </ButtonOption>
      <ButtonOption
        primary
        startIcon={<AiOutlineFundProjectionScreen fontSize="16px" />}
      >
        Kênh bán hàng
      </ButtonOption>
      <ButtonOption primary startIcon={<BiLineChart fontSize="16px" />}>
        Tài chính
      </ButtonOption>
    </MenuReportWrapper>
  );
}

export default MenuReport;

const MenuReportWrapper = styled(Box)(({ theme }) => ({
  width: '250px',
  backgroundColor: theme.palette.primary.second,
}));
