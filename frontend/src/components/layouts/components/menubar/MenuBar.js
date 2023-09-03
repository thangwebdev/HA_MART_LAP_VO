import React from 'react';
import { Box, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import ButtonOption from '~/components/button/ButtonOption';
import {
  HiOutlineViewGridAdd,
  HiOutlineDocumentText,
} from 'react-icons/hi';
import {
  HiOutlineDocumentPlus,
  HiOutlineDocumentMinus,
  HiOutlineRectangleGroup,
} from 'react-icons/hi2';
import {
  BsBoxSeam,
  BsGrid3X3,
  BsBuilding,
  BsBoxArrowInDown,
  BsCashCoin,
  BsBarChartLine,
  BsBuildingAdd,
  BsSegmentedNav,
} from 'react-icons/bs';
import { BiStore, BiTransferAlt } from 'react-icons/bi';
import { CgCloseR } from 'react-icons/cg';
import {
  AiOutlineDeploymentUnit,
  AiOutlineDollarCircle,
  AiOutlineLineChart,
  AiOutlinePieChart,
} from 'react-icons/ai';
import { useLocation, useNavigate } from 'react-router-dom';
import { TiDocumentText } from 'react-icons/ti';
import { RiUser2Line } from 'react-icons/ri';
import { TbFileInvoice } from 'react-icons/tb';
import { VscTelescope } from 'react-icons/vsc';
import { MdOutlinePermContactCalendar, MdOutlineSell } from 'react-icons/md';
import { FiUserCheck } from 'react-icons/fi';

function MenuBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <MenuBarWrapper bgColor={theme.palette.primary.second}>
      <Container maxWidth="xl" sx={{ height: '100%' }}>
        <MenuBarContainer>
          <ButtonOption
            active={location.pathname === '/'}
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<HiOutlineViewGridAdd fontSize="16px" />}
            onClick={() => navigate('/')}
          >
            Tổng quan
          </ButtonOption>
          <ButtonOption
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<BsBoxSeam fontSize="16px" />}
            menuColor={theme.palette.primary.second}
            active={[
              '/list/dmvt',
              '/list/dmnvt',
              '/list/dmdvt',
              '/list/dmlo',
              '/list/dmkho',
            ].includes(location.pathname)}
            popupOptions={[
              {
                text: 'Danh sách hàng hóa',
                startIcon: <BsGrid3X3 fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmvt'),
                active: location.pathname.indexOf('dmvt') >= 0,
              },
              {
                text: 'Nhóm hàng hóa',
                startIcon: <HiOutlineRectangleGroup fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmnvt'),
                active: location.pathname.indexOf('dmnvt') >= 0,
              },
              {
                text: 'Đơn vị tính',
                startIcon: <AiOutlineDeploymentUnit fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmdvt'),
                active: location.pathname.indexOf('dmdvt') >= 0,
              },
              {
                text: 'Kho hàng hóa',
                startIcon: <BiStore fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmkho'),
                active: location.pathname.indexOf('dmkho') >= 0,
              },
              {
                text: 'Lô hàng hóa',
                startIcon: <BsSegmentedNav fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmlo'),
                active: location.pathname.indexOf('dmlo') >= 0,
              },
            ]}
          >
            Hàng hóa
          </ButtonOption>
          <ButtonOption
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<BiTransferAlt fontSize="16px" />}
            menuColor={theme.palette.primary.second}
            active={[
              '/list/dmpnk',
              '/list/dmpkk',
              '/list/dmpxdc',
              '/list/dmpxh',
              '/list/dmpttt',
              '/list/dmpbh',
            ].includes(location.pathname)}
            popupOptions={[
              {
                text: 'Nhập kho',
                startIcon: <BsBoxArrowInDown fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmpnk'),
                active: location.pathname.indexOf('dmpnk') >= 0,
              },
              {
                text: 'Kiểm kho',
                startIcon: <HiOutlineDocumentText fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmpkk'),
                active: location.pathname.indexOf('dmpkk') >= 0,
              },
              {
                text: 'Điều chuyển',
                startIcon: <BiTransferAlt fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmpxdc'),
                active: location.pathname.indexOf('dmpxdc') >= 0,
              },
              {
                text: 'Xuất hủy',
                startIcon: <CgCloseR fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmpxh'),
                active: location.pathname.indexOf('dmpxh') >= 0,
              },
              {
                text: 'Phiếu bán hàng',
                startIcon: <TbFileInvoice fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmpbh'),
                active: location.pathname.indexOf('dmpbh') >= 0,
              },
              {
                text: 'Phương thức thanh toán',
                startIcon: <BsBuilding fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmpttt'),
                active: location.pathname.indexOf('dmpttt') >= 0,
              },
            ]}
          >
            Giao dịch
          </ButtonOption>
          <ButtonOption
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<AiOutlineDollarCircle fontSize="16px" />}
            menuColor={theme.palette.primary.second}
            active={[
              '/list/dmpt',
              '/list/dmpc',
              '/list/dmlpt',
              '/list/dmlpc',
              '/soquy',
            ].includes(location.pathname)}
            popupOptions={[
              {
                text: 'Phiếu thu',
                startIcon: <HiOutlineDocumentPlus fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmpt'),
                active: location.pathname.indexOf('dmpt') >= 0,
              },
              {
                text: 'Loại phiếu thu',
                startIcon: <TiDocumentText fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmlpt'),
                active: location.pathname.indexOf('dmlpt') >= 0,
              },
              {
                text: 'Phiếu chi',
                startIcon: <HiOutlineDocumentMinus fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmpc'),
                active: location.pathname.indexOf('dmpc') >= 0,
              },
              {
                text: 'Loại phiếu chi',
                startIcon: <TiDocumentText fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmlpc'),
                active: location.pathname.indexOf('dmlpc') >= 0,
              },
              {
                text: 'Sổ quỹ',
                startIcon: <BsCashCoin fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/soquy'),
                active: location.pathname.indexOf('/soquy') >= 0,
              },
            ]}
          >
            Sổ quỹ
          </ButtonOption>
          <ButtonOption
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<MdOutlinePermContactCalendar fontSize="16px" />}
            menuColor={theme.palette.primary.second}
            active={[
              '/list/dmkh',
              '/list/dmncc',
              '/list/dmnv',
              '/list/dmkb',
            ].includes(location.pathname)}
            popupOptions={[
              {
                text: 'Khách hàng',
                startIcon: <RiUser2Line fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmkh'),
                active: location.pathname.indexOf('dmkh') >= 0,
              },
              {
                text: 'Nhà cung cấp',
                startIcon: <BsBuildingAdd fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmncc'),
                active: location.pathname.indexOf('dmncc') >= 0,
              },
              {
                text: 'Nhân viên',
                startIcon: <FiUserCheck fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmnv'),
                active: location.pathname.indexOf('dmnv') >= 0,
              },
              {
                text: 'Kênh bán hàng',
                startIcon: <VscTelescope fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmkb'),
                active: location.pathname.indexOf('dmkb') >= 0,
              },
            ]}
          >
            Đối tác
          </ButtonOption>
          <ButtonOption
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<AiOutlinePieChart fontSize="16px" />}
            menuColor={theme.palette.primary.second}
            active={[
              '/report/hanghoa',
              '/report/doanhthu',
              '/report/loinhuan',
            ].includes(location.pathname)}
            popupOptions={[
              {
                text: 'Báo cáo hàng hóa',
                startIcon: <MdOutlineSell fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/report/hanghoa'),
                active: location.pathname.indexOf('/report/hanghoa') >= 0,
              },
              {
                text: 'Báo cáo doanh thu',
                startIcon: <BsBarChartLine fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/report/doanhthu'),
                active: location.pathname.indexOf('/report/doanhthu') >= 0,
              },
              {
                text: 'Báo cáo lợi nhuận',
                startIcon: <AiOutlineLineChart fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/report/loinhuan'),
                active: location.pathname.indexOf('/report/loinhuan') >= 0,
              },
            ]}
          >
            Báo cáo
          </ButtonOption>
        </MenuBarContainer>
      </Container>
    </MenuBarWrapper>
  );
}

export default MenuBar;

const MenuBarWrapper = styled.div`
  height: 42px;
  background-color: ${(props) => props.bgColor};
`;
const MenuBarContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  gap: 10px;
`;
