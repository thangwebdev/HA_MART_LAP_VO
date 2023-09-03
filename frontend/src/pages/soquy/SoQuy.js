
import React, { useState} from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import TableDisplay from '~/components/table/TableDisplay';
import useApisContext from '~/hooks/hookContext/useApisContext';
import { formatDateDisplay, numeralCustom } from '~/utils/helpers';
import AdminLayout from '~/components/layouts/AdminLayout';
import { useEffect } from 'react';
import FilterTimeFromTo from '~/components/filter/FilterTimeFromTo';
import moment from 'moment';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import FilterSelectApi from '~/components/filter/FilterSelectApi';
import FilterRadios from '~/components/filter/FilterRadios';
import useResponsive from '~/hooks/useResponsive';

const sqColumns = [
  {
    name: 'Mã chứng từ',
    selector: (row) => row.ma_ct,
    sortable: true,
    width: '130px',
    wrap: true,
  },
  {
    name: 'Loại chứng từ',
    selector: (row) => row.ten_loai_ct,
    sortable: true,
    wrap: true,
    width: '130px',
    center: true,
  },
  {
    name: 'Kho',
    selector: (row) => row.ten_kho,
    sortable: true,
    wrap: true,
    width: '130px',
    center: true,
  },
  {
    name: 'Ngày chứng từ',
    selector: (row) => row.ngay_ct,
    format: (row) => formatDateDisplay(row.ngay_ct),
    sortable: true,
    center: true,
    width: '130px',
  },
  {
    name: 'Giá trị',
    selector: (row) => row.gia_tri,
    format: (row) => numeralCustom(row.gia_tri).format(),
    sortable: true,
    center: true,
    width: '130px',
  },
  {
    name: 'Diễn giải',
    selector: (row) => row.dien_giai,
    sortable: true,
    left: true,
    wrap: true,
    grow: 1,
  },
];

const loaiChungTus = [
  { value: '', label: 'Tất cả' },
  { value: 'pct', label: 'Phiếu chi tiền' },
  { value: 'ptt', label: 'Phiếu thu tiền' },
];

export default function SoQuy() {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const alertSnackbar = useSnackbarContext();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 20,
    kho: null,
    ma_loai_ct: loaiChungTus[0].value,
    timeFrom: moment().startOf('months').format('YYYY-MM-DD'),
    timeTo: moment().format('YYYY-MM-DD'),
  });
  const { callApi } = useApisContext();
  const [data, setData] = useState([]);
  // get sổ quỹ
  const getSoQuy = async (condition) => {
    try {
      setLoading(true);
      const resp = await callApi({
        method: 'post',
        endpoint: '/soquy',
        data: condition,
      });
      setData(resp);
    } catch (error) {
      alertSnackbar('error', error?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  // render total
  const renderTotal = () => {
    return (
      <Stack direction="row" spacing="20px" alignItems="center">
        <Stack direction="row" alignItems="center" spacing="5px">
          <Box
            sx={{
              width: '20px',
              height: '10px',
              backgroundColor: 'secondary.main',
            }}
          ></Box>
          <Typography sx={{ fontSize: '13px' }}>Tồn đầu kỳ:</Typography>
          <Typography sx={{ mr: '50px', fontSize: '13px' }}>
            {numeralCustom(data?.ton_dau_ky).format()}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing="5px">
          <Box
            sx={{
              width: '20px',
              height: '10px',
              backgroundColor: 'primary.second',
            }}
          ></Box>
          <Typography sx={{ fontSize: '13px' }}>Tổng thu:</Typography>
          <Typography sx={{ mr: '50px', fontSize: '13px' }}>
            {numeralCustom(data?.tong_thu).format()}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing="5px">
          <Box
            sx={{
              width: '20px',
              height: '10px',
              backgroundColor: 'thirdly.main',
            }}
          ></Box>
          <Typography sx={{ fontSize: '13px' }}>Tổng chi:</Typography>
          <Typography sx={{ mr: '50px', fontSize: '13px' }}>
            {numeralCustom(data?.tong_chi).format()}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing="5px">
          <Box
            sx={{
              width: '20px',
              height: '10px',
              backgroundColor: 'primary.main',
            }}
          ></Box>
          <Typography sx={{ fontSize: '13px' }}>Tồn cuối kỳ: </Typography>
          <Typography sx={{ fontSize: '13px' }}>
            {numeralCustom(data?.ton_cuoi_ky).format()}
          </Typography>
        </Stack>
      </Stack>
    );
  };

  useEffect(() => {
    const condition = { page: filter.page, limit: filter.limit };
    if (filter.timeFrom) {
      condition.tu_ngay = filter.timeFrom;
    }
    if (filter.timeTo) {
      condition.den_ngay = filter.timeTo;
    }
    if (filter.kho) {
      condition.ma_kho = filter.kho.ma_kho;
    }
    if (filter.ma_loai_ct) {
      condition.ma_loai_ct = filter.ma_loai_ct;
    }
    getSoQuy(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <AdminLayout>
      <Box sx={{ padding: '10px 0' }}>
        <Grid container spacing={2}>
          {mdMatches && (
            <Grid item md={2.5}>
              <Stack
                spacing="10px"
                className="custome-scrolly"
                sx={{
                  padding: '2px',
                  height: 'calc(100vh - 50px - 42px - 20px)',
                  overflow: 'auto',
                }}
              >
                <FilterSelectApi
                  title="Kho"
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
                <FilterRadios
                  title="Loại chứng từ"
                  values={loaiChungTus}
                  defaultValue={filter.ma_loai_ct}
                  onChange={(value) =>
                    setFilter({ ...filter, ma_loai_ct: value })
                  }
                />
                <FilterTimeFromTo
                  title="Ngày chứng từ"
                  defaultTimeFrom={filter.timeFrom}
                  defaultTimeTo={filter.timeTo}
                  onSearch={(time) => setFilter({ ...filter, ...time })}
                />
              </Stack>
            </Grid>
          )}
          <Grid item xs={12} md={9.5}>
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              sx={{ mb: '10px' }}
            >
              <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>
                Báo Cáo Sổ Quỹ
              </Typography>
              {mdMatches && renderTotal()}
            </Stack>
            {!mdMatches && (
              <Stack
                direction="row"
                alignItems="center"
                sx={{ height: '30px' }}
              >
                {renderTotal()}
              </Stack>
            )}
            <Box>
              <TableDisplay
                title="sổ quỹ"
                progressPending={loading}
                data={data?.records}
                columns={sqColumns}
                fixedHeaderScrollHeight={`calc(100vh - 50px - ${
                  mdMatches ? '42px' : '30px'
                } - 20px - 40px - 56px)`}
                pagination
                paginationPerPage={filter.limit}
                paginationTotalRows={data.count}
                onChangePage={(page) => setFilter({ ...filter, page })}
                onChangeRowsPerPage={(rowPerPage) =>
                  setFilter({ ...filter, limit: rowPerPage })
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}

