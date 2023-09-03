import {
  AiOutlineDeploymentUnit,
  AiOutlineDollarCircle,
  AiOutlineLineChart,
  AiOutlinePieChart,
} from 'react-icons/ai';
import { BiStore, BiTransferAlt, BiUserCheck } from 'react-icons/bi';
import {
  BsBarChartLine,
  BsBoxArrowInDown,
  BsBoxSeam,
  BsBuilding,
  BsBuildingAdd,
  BsCashCoin,
  BsGrid3X3,
} from 'react-icons/bs';
import { CgCloseR } from 'react-icons/cg';
import { FiUserCheck } from 'react-icons/fi';
import {
  HiOutlineDocumentText,
  HiOutlineInbox,
  HiOutlineViewGridAdd,
} from 'react-icons/hi';
import {
  HiOutlineDocumentMinus,
  HiOutlineDocumentPlus,
  HiOutlineRectangleGroup,
} from 'react-icons/hi2';
import { MdOutlineSell } from 'react-icons/md';
import { RiUser2Line } from 'react-icons/ri';
import { TbFileInvoice } from 'react-icons/tb';
import { TiDocumentText } from 'react-icons/ti';
import { VscTelescope } from 'react-icons/vsc';

const menus = [
  {
    text: 'Tổng quan',
    path: '/',
    icon: <HiOutlineViewGridAdd fontSize="16px" />,
  },
  {
    text: 'Hàng hóa',
    icon: <BsBoxSeam fontSize="16px" />,
    subs: [
      {
        text: 'Danh sách hàng hóa',
        icon: <BsGrid3X3 fontSize="14px" />,
        path: '/list/dmvt',
      },
      {
        text: 'Nhóm hàng hóa',
        icon: <HiOutlineRectangleGroup fontSize="14px" />,
        path: '/list/dmnvt',
      },
      {
        text: 'Đơn vị tính',
        icon: <AiOutlineDeploymentUnit fontSize="14px" />,
        path: '/list/dmdvt',
      },
      {
        text: 'Kho hàng hóa',
        icon: <BiStore fontSize="14px" />,
        path: '/list/dmkho',
      },
      {
        text: 'Lô hàng hóa',
        icon: <HiOutlineInbox fontSize="14px" />,
        path: '/list/dmlo',
      },
    ],
  },
  {
    text: ' Giao dịch',
    icon: <BiTransferAlt fontSize="16px" />,
    subs: [
      {
        text: 'Nhập kho',
        icon: <BsBoxArrowInDown fontSize="14px" />,
        path: '/list/dmpnk',
      },
      {
        text: 'Kiểm kho',
        icon: <HiOutlineDocumentText fontSize="14px" />,
        path: '/list/dmpkk',
      },
      {
        text: 'Điều chuyển',
        icon: <BiTransferAlt fontSize="14px" />,
        path: '/list/dmpxdc',
      },
      {
        text: 'Xuất hủy',
        icon: <CgCloseR fontSize="14px" />,
        path: '/list/dmpxh',
      },
      {
        text: 'Phiếu bán hàng',
        icon: <TbFileInvoice fontSize="14px" />,
        path: '/list/dmpbh',
      },
      {
        text: 'Phương thức thanh toán',
        icon: <BsBuilding fontSize="14px" />,
        path: '/list/dmpttt',
      },
    ],
  },
  {
    text: 'Sổ quỹ',
    icon: <AiOutlineDollarCircle fontSize="16px" />,
    subs: [
      {
        text: 'Phiếu thu',
        icon: <HiOutlineDocumentPlus fontSize="14px" />,
        path: '/list/dmpt',
      },
      {
        text: 'Loại phiếu thu',
        icon: <TiDocumentText fontSize="14px" />,
        path: '/list/dmlpt',
      },
      {
        text: 'Phiếu chi',
        icon: <HiOutlineDocumentMinus fontSize="14px" />,
        path: '/list/dmpc',
      },
      {
        text: 'Loại phiếu chi',
        icon: <TiDocumentText fontSize="14px" />,
        path: '/list/dmlpc',
      },
      {
        text: 'Sổ quỹ',
        icon: <BsCashCoin fontSize="14px" />,
        path: '/soquy',
      },
    ],
  },
  {
    text: 'Đối tác',
    icon: <BiUserCheck fontSize="16px" />,
    subs: [
      {
        text: 'Khách hàng',
        icon: <RiUser2Line fontSize="14px" />,
        path: '/list/dmkh',
      },
      {
        text: 'Nhà cung cấp',
        icon: <BsBuildingAdd fontSize="14px" />,
        path: '/list/dmncc',
      },
      {
        text: 'Nhân viên',
        icon: <FiUserCheck fontSize="14px" />,
        path: '/list/dmnv',
      },
      {
        text: 'Kênh bán hàng',
        icon: <VscTelescope fontSize="14px" />,
        path: '/list/dmkb',
      },
    ],
  },
  {
    text: 'Báo cáo',
    icon: <AiOutlinePieChart fontSize="16px" />,
    subs: [
      {
        text: 'Báo cáo hàng hóa',
        icon: <MdOutlineSell fontSize="14px" />,
        path: '/report/hanghoa',
      },
      {
        text: 'Báo cáo doanh thu',
        icon: <BsBarChartLine fontSize="14px" />,
        path: '/report/doanhthu',
      },
      {
        text: 'Báo cáo lợi nhuận',
        icon: <AiOutlineLineChart fontSize="14px" />,
        path: '/report/loinhuan',
      },
    ],
  },
];

export { menus };
