import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Grid, Paper, Stack, Typography } from '@mui/material';
import BankIcon from '~/assets/img/iconbank.png';
import BillIcon from '~/assets/img/iconBill.png';
import CustomerIcon from '~/assets/img/iconCustomer.png';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import moment from 'moment';
import { numeralCustom } from '~/utils/helpers';

function ResultSellToday() {
  const { asyncGetList } = useApisContext();
  const alertSnackbar = useSnackbarContext();
  const [pbhs, setPbhs] = useState({
    today: null,
    yesterday: null,
  });

  // get pbh yesterday and today
  const getPbhYesterdayAndToday = async () => {
    try {
      const today = moment();
      const yesterday = moment().subtract(1, 'days');
      const conditionYesterday = {
        ma_trang_thai: 2,
        ngay: yesterday.date(),
        thang: yesterday.month() + 1,
        nam: yesterday.year(),
      };
      const conditionToday = {
        ma_trang_thai: { $in: [1, 2] },
        ngay: today.date(),
        thang: today.month() + 1,
        nam: today.year(),
      };
      Promise.all([
        asyncGetList('dmpbh', conditionYesterday),
        asyncGetList('dmpbh', conditionToday),
      ])
        .then(([respYesterday, respToday]) => {
          setPbhs({ yesterday: respYesterday, today: respToday });
        })
        .catch((error) => {
          alertSnackbar(
            error?.response?.data?.message || 'Internal server error'
          );
        });
    } catch (error) {
      alertSnackbar(error?.message || 'Internal server error');
    }
  };

  // doanh thu hom nay
  const revenueToday = useMemo(() => {
    if (pbhs.today) {
      return (pbhs.today?.data || []).reduce((acc, item) => {
        if (item.ma_trang_thai === 2) {
          return acc + item.thanh_tien;
        } else {
          return acc;
        }
      }, 0);
    } else {
      return 0;
    }
  }, [pbhs.today]);
  // doanh thu hom qua
  const revenueYesterday = useMemo(() => {
    if (pbhs.yesterday) {
      return (pbhs.yesterday?.data || []).reduce((acc, item) => {
        return acc + item.thanh_tien;
      }, 0);
    } else {
      return 0;
    }
  }, [pbhs.yesterday]);

  // tinh ty suat tang truong doanh thu
  const tySuat = useMemo(() => {
    const result = {
      isIncrease: revenueToday >= revenueYesterday ? true : false,
      percent: 0,
    };
    if (revenueToday > 0 && revenueYesterday > 0) {
      const percent =
        (Math.abs(revenueToday - revenueYesterday) / revenueYesterday) * 100;
      result.percent = Math.round(percent);
    }
    return result;
  }, [revenueToday, revenueYesterday]);

  // tinh don dang co khach
  const pbhDangCoKhach = useMemo(() => {
    const result = { count: 0, doanhThu: 0 };
    if (pbhs.today) {
      (pbhs.today?.data || []).forEach((item) => {
        if (item.ma_trang_thai === 1) {
          result.count += 1;
          result.doanhThu += item.thanh_tien;
        }
      });
    }
    return result;
  }, [pbhs.today]);

  useEffect(() => {
    getPbhYesterdayAndToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 550, mb: '10px' }}>
        KẾT QUẢ BÁN HÀNG HÔM NAY
      </Typography>
      <Grid container spacing={2}>
        {/* Đơn bán */}
        <Grid item xs={12} sm={6} md={4}>
          <Stack
            sx={{
              width: '100%',
              backgroundColor: 'primary.fif',
              padding: '5px',
              borderRadius: '8px',
              height: '100%',
            }}
            direction="row"
            gap={2}
            alignItems="center"
          >
            <Avatar
              src={BankIcon}
              sx={{ width: 50, height: 50, borderRadius: 0 }}
            />
            <Stack>
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
                {pbhs?.today?.count - pbhDangCoKhach.count} đơn đã xong
              </Typography>
              <Stack direction="row" gap={1} alignItems="center">
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 550,
                    color: 'secondary.main',
                  }}
                >
                  {numeralCustom(revenueToday).format()}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="2px"
                  sx={{
                    color: tySuat?.isIncrease ? 'primary.main' : 'thirdly.main',
                  }}
                >
                  {tySuat?.isIncrease ? (
                    <BsArrowUpShort
                      size={14}
                      style={{ color: 'currentcolor' }}
                    />
                  ) : (
                    <BsArrowDownShort
                      size={14}
                      style={{ color: 'currentcolor' }}
                    />
                  )}

                  <Typography sx={{ fontSize: '10px' }}>
                    {tySuat?.percent ? tySuat.percent : 0} %
                  </Typography>
                </Stack>
              </Stack>
              <Typography sx={{ fontSize: '12px', color: 'gray' }}>
                Hôm qua {numeralCustom(revenueYesterday).format()}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* Đơn đang phục vụ */}
        <Grid item xs={12} sm={6} md={4}>
          <Stack
            sx={{
              width: '100%',
              backgroundColor: 'secondary.fif',
              padding: '5px',
              borderRadius: '8px',
              height: '100%',
            }}
            direction="row"
            gap={2}
            alignItems="center"
          >
            <Avatar
              src={BillIcon}
              sx={{ width: 50, height: 50, borderRadius: 0 }}
            />
            <Stack>
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
                {pbhDangCoKhach.count} đơn đang phục vụ
              </Typography>
              <Stack direction="row" gap={1} alignItems="center">
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 550,
                    color: 'secondary.main',
                  }}
                >
                  {numeralCustom(pbhDangCoKhach.doanhThu).format()}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        {/* Khách hàng */}
        <Grid item xs={12} sm={6} md={4}>
          <Stack
            sx={{
              width: '100%',
              backgroundColor: 'thirdly.fif',
              padding: '5px',
              borderRadius: '8px',
              height: '100%',
            }}
            direction="row"
            gap={2}
            alignItems="center"
          >
            <Avatar
              src={CustomerIcon}
              sx={{ width: 50, height: 50, borderRadius: 0 }}
            />
            <Stack>
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
                Khách hàng
              </Typography>
              <Stack direction="row" gap={1} alignItems="center">
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 550,
                    color: 'secondary.main',
                  }}
                >
                  20
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="2px"
                  sx={{ color: 'primary.main' }}
                >
                  <BsArrowUpShort size={14} style={{ color: 'currentcolor' }} />
                  <Typography sx={{ fontSize: '10px' }}>5%</Typography>
                </Stack>
              </Stack>
              <Typography sx={{ fontSize: '12px', color: 'gray' }}>
                Hôm qua 18
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ResultSellToday;
