import { Box, Grid, Stack, Typography, IconButton } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import FilterTimeFromTo from '~/components/filter/FilterTimeFromTo';
import AdminLayout from '~/components/layouts/AdminLayout';
import moment from 'moment';
import TableDisplay from '~/components/table/TableDisplay';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import useApisContext from '~/hooks/hookContext/useApisContext';
import { useEffect } from 'react';
import FilterSelectApi from '~/components/filter/FilterSelectApi';
import FilterRadios from '~/components/filter/FilterRadios';
import { useMemo } from 'react';
import { numeralCustom } from '~/utils/helpers';
import useResponsive from '~/hooks/useResponsive';
import { BiFilterAlt } from 'react-icons/bi';
import DrawerBase from '~/components/drawer/DrawerBase';

const filterBase = {
  timeFrom: moment().startOf('month').format('YYYY-MM-DD'),
  timeTo: moment().format('YYYY-MM-DD'),
  vatTu: null,
  kho: null,
  page: 1,
  limit: 20,
};

const concerns = [
  {
    label: 'Bán hàng',
    value: '1',
    columns: [
      { name: 'Mã hàng hóa', selector: (row) => row.ma_vt, minWidth: '130px' },
      {
        name: 'Tên hàng hóa',
        selector: (row) => row.ten_vt,
        minWidth: '130px',
        center: true,
      },
      {
        name: 'Số lượng bán',
        selector: (row) => row.t_sl_ban,
        minWidth: '130px',
        center: true,
      },
      {
        name: 'Doanh thu (thuần)',
        selector: (row) => row.doanh_thu_thuan,
        format: (row) => numeralCustom(row.doanh_thu_thuan).format(),
        minWidth: '130px',
        right: true,
      },
    ],
  },
  {
    label: 'Lợi nhuận',
    value: '2',
    columns: [
      {
        name: 'Mã hàng hóa',
        selector: (row) => row.ma_vt,
        minWidth: '130px',
      },
      {
        name: 'Tên hàng hóa',
        selector: (row) => row.ten_vt,
        minWidth: '130px',
        wrap: true,
      },
      {
        name: 'Số lượng bán',
        selector: (row) => row.t_sl_ban,
        minWidth: '130px',
        wrap: true,
        center: true,
      },
      {
        name: 'Doanh thu thuần',
        selector: (row) => row.doanh_thu_thuan,
        format: (row) => numeralCustom(row.doanh_thu_thuan).format(),
        minWidth: '130px',
        wrap: true,
        center: true,
      },
      {
        name: 'Tổng giá vốn',
        selector: (row) => row.t_gia_von,
        format: (row) => numeralCustom(row.t_gia_von).format(),
        minWidth: '130px',
        wrap: true,
        center: true,
      },
      {
        name: 'Lợi nhuận',
        selector: (row) => row.loi_nhuan,
        format: (row) => numeralCustom(row.loi_nhuan).format(),
        minWidth: '130px',
        wrap: true,
        center: true,
      },
      {
        name: 'Tỷ suất',
        selector: (row) =>
          `${((1 - row.t_gia_von / row.doanh_thu_thuan) * 100).toFixed(2)}%`,
        minWidth: '130px',
        wrap: true,
        right: true,
      },
    ],
  },
  {
    label: 'Xuất nhập tồn',
    value: '3',
    columns: [
      {
        name: 'Mã hàng hóa',
        selector: (row) => row.ma_vt,
        minWidth: '130px',
      },
      {
        name: 'Tên hàng hóa',
        selector: (row) => row.ten_vt,
        minWidth: '130px',
        wrap: true,
      },
      {
        name: 'Tồn đầu kỳ',
        selector: (row) => row.ton_dau_ky,
        minWidth: '130px',
        center: true,
      },
      {
        name: 'Nhập kho',
        selector: (row) => row.nhap_kho,
        minWidth: '130px',
        center: true,
      },
      {
        name: 'Xuất kho',
        selector: (row) => row.xuat_kho,
        width: '130px',
        center: true,
      },
      {
        name: 'Tồn cuối kỳ',
        selector: (row) => row.ton_cuoi_ky,
        minWidth: '130px',
        right: true,
      },
    ],
  },
  {
    label: 'Khách theo hàng bán',
    value: '4',
    columns: [
      {
        name: 'Mã hàng hóa',
        selector: (row) => row.ma_vt,
        minWidth: '130px',
      },
      {
        name: 'Tên hàng hóa',
        selector: (row) => row.ten_vt,
        minWidth: '130px',
        wrap: true,
      },
      {
        name: 'Số lượng khách',
        selector: (row) => row.sl_khach,
        minWidth: '130px',
        wrap: true,
        center: true,
      },
      {
        name: 'Số lượng mua',
        selector: (row) => row.sl_mua,
        minWidth: '130px',
        wrap: true,
        center: true,
      },
      {
        name: 'Giá trị',
        selector: (row) => row.gia_tri,
        format: (row) => numeralCustom(row.gia_tri).format(),
        minWidth: '130px',
        wrap: true,
        right: true,
      },
    ],
  },
  {
    label: 'NCC theo hàng nhập',
    value: '5',
    columns: [
      {
        name: 'Mã hàng hóa',
        selector: (row) => row.ma_vt,
        minWidth: '130px',
      },
      {
        name: 'Tên hàng hóa',
        selector: (row) => row.ten_vt,
        minWidth: '130px',
        wrap: true,
      },
      {
        name: 'SL nhà cung cấp',
        selector: (row) => row.sl_ncc,
        minWidth: '130px',
        wrap: true,
        center: true,
      },
      {
        name: 'Số lượng nhập',
        selector: (row) => row.sl_nhap,
        minWidth: '130px',
        wrap: true,
        center: true,
      },
      {
        name: 'Giá trị',
        selector: (row) => row.gia_tri,
        format: (row) => numeralCustom(row.gia_tri).format(),
        minWidth: '130px',
        wrap: true,
        right: true,
      },
    ],
  },
];

function ReportHangHoaPage() {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const alertSnackbar = useSnackbarContext();
  const { asyncReport } = useApisContext();
  const [concern, setConcern] = useState(concerns[0].value);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);
  const [filter, setFilter] = useState({
    ...filterBase,
  });

  const columns = useMemo(() => {
    return concerns.find((item) => item.value === concern).columns;
  }, [concern]);

  const getXNT = async (condition) => {
    try {
      setLoading(true);
      const resp = await asyncReport({
        endpoint: '/hanghoa/tonghop',
        data: condition,
      });
      if (resp) {
        setData(resp);
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  // render filter
  const renderFilter = () => (
    <Box
      className="custome-scrolly"
      sx={{
        width: '100%',
        height: `calc(100vh - 50px - ${mdMatches ? '42px' : '0px'} - 20px)`,
        overflow: 'auto',
        padding: '1px',
      }}
    >
      <Stack spacing={1}>
        <FilterRadios
          title="Mối quan tâm"
          values={concerns}
          defaultValue={concern}
          onChange={(value) => setConcern(value)}
        />
        <FilterSelectApi
          title="Hàng hóa"
          apiCode="dmvt"
          value={
            filter.vatTu
              ? {
                  ma_vt: filter.vatTu.ma_vt,
                  ten_vt: filter.vatTu.ten_vt,
                }
              : null
          }
          searchFileds={['ma_vt', 'ten_vt']}
          getOptionLabel={(option) => option.ten_vt}
          onSelect={(value) => setFilter({ ...filter, vatTu: value })}
        />
        <FilterSelectApi
          title="Kho/ chi nhánh"
          apiCode="dmkho"
          value={
            filter.kho
              ? {
                  ma_kho: filter.kho.ma_kho,
                  ten_kho: filter.kho.ten_kho,
                }
              : null
          }
          searchFileds={['ma_kho', 'ten_kho']}
          getOptionLabel={(option) => option.ten_kho}
          onSelect={(value) => setFilter({ ...filter, kho: value })}
        />
        <FilterTimeFromTo
          defaultTimeFrom={filter.timeFrom}
          defaultTimeTo={filter.timeTo}
          title="Thời gian"
          onSearch={(time) => {
            setFilter({ ...filter, ...time });
          }}
        />
      </Stack>
    </Box>
  );

  useEffect(() => {
    const condition = { page: filter.page, limit: filter.limit, type: concern };
    if (filter.timeFrom) {
      condition.tu_ngay = filter.timeFrom;
    }
    if (filter.timeTo) {
      condition.den_ngay = filter.timeTo;
    }
    if (filter.vatTu) {
      condition.ma_vt = filter.vatTu.ma_vt;
    }
    if (filter.kho) {
      condition.ma_kho = filter.kho.ma_kho;
    }
    getXNT(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, concern]);

  return (
    <>
      {!mdMatches && (
        <DrawerBase
          open={openDrawerFilter}
          title="Điều kiện lọc"
          onClose={() => setOpenDrawerFilter(false)}
          zIndex={1}
        >
          <Box sx={{ width: '80vw', maxWidth: '300px' }}>{renderFilter()}</Box>
        </DrawerBase>
      )}
      <AdminLayout>
        <Box sx={{ padding: '10px 0' }}>
          <Grid container spacing="10px" alignItems="flex-start">
            {mdMatches && (
              <Grid item md={2.5}>
                {renderFilter()}
              </Grid>
            )}
            <Grid item xs={12} md={9.5}>
              <Stack direction="row" alignItems="center">
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: 500,
                    marginBottom: '10px',
                  }}
                >
                  Báo cáo hàng hóa
                </Typography>
              </Stack>
              {!mdMatches && (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ height: '40px' }}
                >
                  <IconButton
                    sx={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '4px',
                      backgroundColor: 'primary.main',
                      color: 'whitish.pureWhite',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'whitish.pureWhite',
                      },
                    }}
                    onClick={() => setOpenDrawerFilter(true)}
                  >
                    <BiFilterAlt size="16px" />
                  </IconButton>
                </Stack>
              )}
              <Box
                className="hidden-scroll"
                sx={{
                  height: 'calc(100vh - 50px - 42px - 20px - 40px)',
                  overflow: 'auto',
                }}
              >
                <TableDisplay
                  columns={columns}
                  data={data?.data || []}
                  paginationTotalRows={data?.count}
                  pagination
                  onChangePage={(page) => setFilter({ ...filter, page })}
                  onChangeRowsPerPage={(newRowsPerPage) =>
                    setFilter({ ...filter, limit: newRowsPerPage })
                  }
                  fixedHeaderScrollHeight="calc(100vh - 50px - 42px - 20px - 40px - 56px)"
                  progressPending={loading}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AdminLayout>
    </>
  );
}

export default ReportHangHoaPage;
