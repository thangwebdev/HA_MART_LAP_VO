import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TbDiscount2, TbFileInvoice } from 'react-icons/tb';
import SelectApiInput from '~/components/input/SelectApiInput';
import TextInput from '~/components/input/TextInput';
import { dsDanhMuc } from '~/utils/data';
import TotalLine from '../Main/MainRight/TotalLine';
import { BiDollarCircle } from 'react-icons/bi';
import { numeralCustom } from '~/utils/helpers';
import ModeChietKhau from '../Main/MainRight/ModeChietKhau';
import InputPrice from '../InputPrice';
import { MdPayment } from 'react-icons/md';
import { useBillContext } from '../../Bill';
import { cloneDeep } from 'lodash';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useResponsive from '~/hooks/useResponsive';

const currencies = [
  1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000,
];

function Payment() {
  const smMatches = useResponsive({matchKey: 'up', breakpoint: 'sm'})
  const alertSnackbar = useSnackbarContext();
  const { asyncGetList } = useApisContext();
  const { pbhSelected, numberProductDiscounted, updatePbh, handlePayment } = useBillContext();
  const [tienThu, setTienThu] = useState(pbhSelected?.tien_thu || 0);
  const [nhanVien, setNhanVien] = useState(() => {
    if (pbhSelected?.ma_nv) {
      return { ma_nv: pbhSelected?.ma_nv, ten_nv: pbhSelected?.ten_nv };
    } else {
      return null;
    }
  });
  const [khachHang, setKhachHang] = useState(() => {
    if (pbhSelected?.ma_kh) {
      return { ma_kh: pbhSelected?.ma_nv, ten_kh: pbhSelected?.ten_kh };
    } else {
      return null;
    }
  });
  const [kenhBan, setKenhBan] = useState(() => {
    if (pbhSelected?.ma_kenh) {
      return { ma_kenh: pbhSelected?.ma_kenh, ten_kenh: pbhSelected?.ten_kenh };
    } else {
      return null;
    }
  });
  const [pttt, setPttt] = useState(() => {
    if (pbhSelected?.ma_pttt) {
      return { ma_pttt: pbhSelected?.ma_pttt, ten_pttt: pbhSelected?.ten_pttt };
    } else {
      return null;
    }
  });
  const [ptts, setPtts] = useState([]);
  const [isPercent, setIsPercent] = useState(false);
  const [giaTriChietKhau, setGiaTriChietKhau] = useState({
    ty_le_ck_hd: pbhSelected?.ty_le_ck_hd || 0,
    tien_ck_hd: pbhSelected?.tien_ck_hd || 0,
  });

  // update nhan vien
  const updateNhanVien = async (nhanVien) => {
    const pbhClone = cloneDeep(pbhSelected);
    pbhClone.ma_nv = nhanVien?.ma_nv || '';
    pbhClone.ten_nv = nhanVien?.ten_nv || '';
    await updatePbh(pbhClone);
  };
  // update khach hang
  const updateKhachHang = async (khachHang) => {
    const pbhClone = cloneDeep(pbhSelected);
    pbhClone.ma_kh = khachHang?.ma_kh || '';
    pbhClone.ten_kh = khachHang?.ten_kh || '';
    await updatePbh(pbhClone);
  };
  // update kenh ban
  const updateKenhBan = async (kenhBan) => {
    const pbhClone = cloneDeep(pbhSelected);
    pbhClone.ma_kenh = kenhBan?.ma_kenh || '';
    pbhClone.ten_kenh = kenhBan?.ten_kenh || '';
    await updatePbh(pbhClone);
  };
  // update kenh ban
  const updatePttt = async (ptttMoi) => {
    const pbhClone = cloneDeep(pbhSelected);
    pbhClone.ma_pttt = ptttMoi?.ma_pttt || '';
    pbhClone.ten_pttt = ptttMoi?.ten_pttt || '';
    await updatePbh(pbhClone);
  };

  // handle gia tri chiet khau change
  const handleGiaTriChietKhauChange = (e) => {
    let value = numeralCustom(e.target.value).value();
    const tienHang = pbhSelected?.tien_hang;
    if (isPercent) {
      if (value > 100) {
        value = 100;
      }
      const tienCk = (tienHang * value) / 100;
      setGiaTriChietKhau({ ty_le_ck_hd: value, tien_ck_hd: tienCk });
    } else {
      if (value > tienHang) {
        value = tienHang;
      }
      const tyLeCk = (value * 100) / tienHang;
      setGiaTriChietKhau({ ty_le_ck_hd: tyLeCk, tien_ck_hd: value });
    }
  };

  // handleUpdateChietKhau
  const handleUpdateChietKhau = async () => {
    if (pbhSelected?.ty_le_ck_hd !== giaTriChietKhau.ty_le_ck_hd) {
      const pbhClone = cloneDeep(pbhSelected);
      pbhClone.ty_le_ck_hd = giaTriChietKhau.ty_le_ck_hd;
      pbhClone.tien_ck_hd = giaTriChietKhau.tien_ck_hd;
      await updatePbh(pbhClone);
    }
  };

  // handle update tien thu
  const handleUpdateTienThu = async (tienThuMoi) => {
    const pbhClone = cloneDeep(pbhSelected);
    if (tienThuMoi !== pbhClone.tien_thu) {
      pbhClone.tien_thu = tienThuMoi;
      await updatePbh(pbhClone);
    }
  };

  // get pttt
  const getPttt = async () => {
    try {
      const resp = await asyncGetList('dmpttt');
      if (resp) {
        setPtts(resp.data);
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    }
  };

  useEffect(() => {
    if (pbhSelected) {
      setGiaTriChietKhau({
        tien_ck_hd: pbhSelected?.tien_ck_hd || 0,
        ty_le_ck_hd: pbhSelected?.ty_le_ck_hd || 0,
      });
      if (pbhSelected?.ma_pttt) {
        setPttt({
          ma_pttt: pbhSelected?.ma_pttt,
          ten_pttt: pbhSelected?.ten_pttt,
        });
      }
      if (pbhSelected?.ma_nv) {
        setNhanVien({ ma_nv: pbhSelected?.ma_nv, ten_nv: pbhSelected?.ten_nv });
      }
      if (pbhSelected?.ma_kh) {
        setKhachHang({
          ma_kh: pbhSelected?.ma_kh,
          ten_kh: pbhSelected?.ten_kh,
        });
      }
      if (pbhSelected?.ma_kenh) {
        setKenhBan({
          ma_kenh: pbhSelected?.ma_kenh,
          ten_kenh: pbhSelected?.ten_kenh,
        });
      }
    }
  }, [pbhSelected]);

  useEffect(() => {
    getPttt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      justifyContent="space-between"
      sx={{ height: '100%', padding: '10px 0' }}
    >
      <Box
        className="hidden-scroll"
        sx={{
          width: '100%',
          height: 'calc(100% - 45px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflow: 'auto',
          paddingBottom: '10px',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <SelectApiInput
              label="Nhân viên"
              apiCode="dmnv"
              placeholder="Nhân viên bán hàng"
              searchFileds={['ma_nv', 'ten_nv']}
              condition={{ ma_phan_quyen: 4 }}
              getOptionLabel={(option) => `${option.ten_nv} (${option.ma_nv})`}
              selectedValue={nhanVien ? nhanVien : null}
              value={nhanVien ? nhanVien : null}
              onSelect={(value) => {
                setNhanVien(value);
                updateNhanVien(value);
              }}
              FormAdd={dsDanhMuc['dmnv'].Form}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectApiInput
              label="Khách hàng"
              apiCode="dmkh"
              placeholder="Khách hàng"
              searchFileds={['ma_kh', 'ten_kh']}
              getOptionLabel={(option) => option.ten_kh}
              selectedValue={khachHang ? khachHang : null}
              value={khachHang ? khachHang : null}
              onSelect={(value) => {
                setKhachHang(value);
                updateKhachHang(value);
              }}
              FormAdd={dsDanhMuc['dmkh'].Form}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectApiInput
              label="Kênh bán"
              apiCode="dmkb"
              placeholder="Kênh bán hàng"
              searchFileds={['ma_kenh', 'ten_kenh']}
              getOptionLabel={(option) =>
                `${option.ten_kenh} (${option.ma_kenh})`
              }
              selectedValue={kenhBan ? kenhBan : null}
              value={kenhBan ? kenhBan : null}
              onSelect={(value) => {
                setKenhBan(value);
                updateKenhBan(value);
              }}
              FormAdd={dsDanhMuc['dmkb'].Form}
            />
          </Grid>
        </Grid>
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing="5px"
            sx={{ color: 'primary.main', marginBottom: '5px' }}
          >
            <TbDiscount2 size="16px" style={{ color: 'currentcolor' }} />
            <Typography
              sx={{ fontSize: '14px', fontWeight: 500, color: 'primary.main' }}
            >
              Mã giảm giá
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextInput
                label="Chiết khấu giảm giá"
                placeholder="Nhập mã chiết khấu"
              />
            </Grid>
            <Grid item xs={6}>
              <TextInput label="Evoucher" placeholder="Nhập mã evoucher" />
            </Grid>
          </Grid>
        </Box>
        <Stack spacing="5px">
          <Stack
            direction="row"
            alignItems="center"
            spacing="5px"
            sx={{ color: 'primary.main', marginBottom: '5px' }}
          >
            <TbFileInvoice size="16px" style={{ color: 'currentcolor' }} />
            <Typography
              sx={{ fontSize: '14px', fontWeight: 500, color: 'primary.main' }}
            >
              Tiền thanh toán
            </Typography>
          </Stack>
          <Stack spacing="8px">
            <TotalLine
              text="Tổng tiền hàng"
              length={pbhSelected?.details?.length}
              total={numeralCustom(pbhSelected?.tien_hang).format()}
            />
            <TotalLine
              text="Chiết khấu sản phẩm"
              length={numberProductDiscounted}
              total={numeralCustom(pbhSelected?.tien_ck_sp).format()}
            />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontSize: '13px' }}>
                Chiết khấu hóa đơn:
              </Typography>
              <ModeChietKhau
                onChange={({ isPercent }) => {
                  setIsPercent(isPercent);
                }}
              />
              <InputPrice
                width="80px"
                style={{ fontSize: '13px' }}
                value={numeralCustom(
                  isPercent
                    ? giaTriChietKhau.ty_le_ck_hd
                    : giaTriChietKhau.tien_ck_hd
                ).format()}
                onChange={handleGiaTriChietKhauChange}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateChietKhau();
                  }
                }}
                onBlur={handleUpdateChietKhau}
                textAlign="right"
              />
            </Stack>
            <TotalLine
              text="Khách cần trả"
              total={numeralCustom(pbhSelected?.t_thanh_tien).format()}
            />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontSize: '13px' }}>Tiền thu:</Typography>
              <InputPrice
                width="80px"
                style={{ fontSize: '13px' }}
                value={numeralCustom(tienThu).format()}
                onChange={(e) => {
                  setTienThu(numeralCustom(e.target.value).value());
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateTienThu(tienThu);
                  }
                }}
                onBlur={() => handleUpdateTienThu(tienThu)}
                textAlign="right"
              />
            </Stack>
            {!!pbhSelected?.tien_thu && (
              <TotalLine
                text="Phải trả lại"
                total={numeralCustom(pbhSelected?.tien_thoi).format()}
              />
            )}
          </Stack>
        </Stack>
        <Stack spacing="5px">
          <Stack
            direction="row"
            alignItems="center"
            spacing="5px"
            sx={{ color: 'primary.main', marginBottom: '5px' }}
          >
            <BiDollarCircle size="16px" style={{ color: 'currentcolor' }} />
            <Typography
              sx={{ fontSize: '14px', fontWeight: 500, color: 'primary.main' }}
            >
              Mệnh giá
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" flexWrap="wrap" gap="8px">
            {currencies.map((currency) => (
              <Paper
                key={currency}
                component={IconButton}
                onClick={() => {
                  const tienThuMoi = tienThu + Number(currency);
                  setTienThu(tienThuMoi);
                  handleUpdateTienThu(tienThuMoi);
                }}
                sx={{
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {numeralCustom(currency).format()}
              </Paper>
            ))}
            {!!pbhSelected?.t_thanh_tien && (
              <Paper
                component={IconButton}
                onClick={() => {
                  const tienThuMoi =
                    tienThu + Number(pbhSelected?.t_thanh_tien);
                  setTienThu(tienThuMoi);
                  handleUpdateTienThu(tienThuMoi);
                }}
                sx={{
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {numeralCustom(pbhSelected?.t_thanh_tien).format()}
              </Paper>
            )}
          </Stack>
        </Stack>
        <Stack spacing="5px">
          <Stack
            direction="row"
            alignItems="center"
            spacing="5px"
            sx={{ color: 'primary.main', marginBottom: '5px' }}
          >
            <MdPayment size="16px" style={{ color: 'currentcolor' }} />
            <Typography
              sx={{ fontSize: '14px', fontWeight: 500, color: 'primary.main' }}
            >
              Phương thức thanh toán
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" flexWrap="wrap" gap="8px">
            {ptts.length > 0 &&
              ptts.map((item) => (
                <Paper
                  key={item.ma_pttt}
                  component={IconButton}
                  onClick={() => {
                    setPttt(item);
                    updatePttt(item);
                  }}
                  sx={{
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    backgroundColor:
                      item.ma_pttt === pttt?.ma_pttt ? 'primary.main' : '',
                    color:
                      item.ma_pttt === pttt?.ma_pttt ? 'whitish.pureWhite' : '',
                    '&:hover': {
                      backgroundColor:
                        item.ma_pttt === pttt?.ma_pttt ? 'primary.main' : '',
                      color:
                        item.ma_pttt === pttt?.ma_pttt
                          ? 'whitish.pureWhite'
                          : '',
                    },
                  }}
                >
                  {item.ten_pttt}
                </Paper>
              ))}
          </Stack>
        </Stack>
      </Box>
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="flex-end"
        spacing="10px"
        sx={{
          height: '45px',
          borderTop: '1px dashed',
          borderColor: '#ccc',
        }}
      >
        <Button
          sx={{
            width: smMatches ? '100px' : '50%',
            backgroundColor: 'whitish.gray',
            color: 'neutral.text1',
            '&:hover': {
              backgroundColor: 'whitish.gray',
            },
          }}
        >
          In
        </Button>
        <Button
          onClick={handlePayment}
          sx={{
            width: smMatches ? '160px' :  '50%',
            backgroundColor: 'primary.main',
            color: 'whitish.pureWhite',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'whitish.pureWhite',
            },
          }}
        >
          Thanh toán {smMatches ? '(F9)' : ''}
        </Button>
      </Stack>
    </Stack>
  );
}

export default Payment;
