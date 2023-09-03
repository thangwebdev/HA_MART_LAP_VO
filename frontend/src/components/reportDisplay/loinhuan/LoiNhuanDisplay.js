import { Box, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import BarChart from '~/components/chart/BarChart';
import TableDisplay from '~/components/table/TableDisplay';
import { numeralCustom } from '~/utils/helpers';
import { useTheme } from '@mui/material/styles';
import useResponsive from '~/hooks/useResponsive';
import { IconButton } from '@mui/material'
import { BiFilterAlt } from 'react-icons/bi';

const columns = [
  {
    name: 'Nhóm / thời gian',
    minWidth: '180px',
    wrap: true,
    selector: (row) => row.label,
    left: true,
  },
  {
    name: 'Tổng doanh thu',
    center: true,
    minWidth: '180px',
    wrap: true,
    selector: (row) => row.tong_doanh_thu,
    format: (row) => numeralCustom(row.tong_doanh_thu).format(),
  },
  {
    name: 'Tổng chi phí',
    center: true,
    minWidth: '180px',
    wrap: true,
    selector: (row) => row.tong_chi_phi,
    format: (row) => numeralCustom(row.tong_chi_phi).format(),
  },
  {
    name: 'Lợi nhuận',
    center: true,
    minWidth: '180px',
    wrap: true,
    selector: (row) => row.loi_nhuan,
    format: (row) => numeralCustom(row.loi_nhuan).format(),
  },
];

function LoiNhuanDisplay({ data, isChart, setOpenDrawerFilter = () => {} }) {
  const theme = useTheme();
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });

  // render total
  const renderTotal = () => (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      spacing={2}
      sx={{ flex: 1 }}
    >
      <Stack direction="row" alignItems="center" gap="5px">
        <Box
          sx={{
            width: 20,
            height: 10,
            backgroundColor: 'secondary.main',
          }}
        ></Box>
        <Typography sx={{ fontSize: '13px' }}>
          Tổng lợi nhuận: {numeralCustom(tongLoiNhuan).format()}
        </Typography>
      </Stack>
    </Stack>
  );

  const labels = useMemo(() => {
    return (data.data || []).map((item) => item.label);
  }, [data]);
  const dataChart = useMemo(() => {
    return (data.data || []).map((item) => item.loi_nhuan);
  }, [data]);
  const tongLoiNhuan = useMemo(() => {
    return (data.data || []).reduce((acc, item) => {
      return acc + item.loi_nhuan;
    }, 0);
  }, [data]);

  return (
    <>
      <Stack direction="row" alignItems="center">
        <Typography
          sx={{ fontSize: '20px', fontWeight: 500, marginBottom: '10px' }}
        >
          Báo cáo lợi nhuận
        </Typography>
        {mdMatches && renderTotal()}
      </Stack>
      {!mdMatches && (
        <Stack
          sx={{ height: '50px' }}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
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
          {renderTotal()}
        </Stack>
      )}
      <Box
        className="hidden-scroll"
        sx={{
          height: `calc(100vh - 50px - 42px - 20px - 40px ${
            !mdMatches ? '- 50px' : '- 0px'
          })`,
          overflow: 'auto',
        }}
      >
        {isChart ? (
          <BarChart
            titleChart={data?.title || ''}
            labels={labels}
            datasets={[
              {
                label: 'Lợi nhuận',
                backgroundColor: theme.palette.secondary.main,
                data: dataChart,
              },
            ]}
          />
        ) : (
          <TableDisplay
            columns={columns}
            data={data.data}
            fixedHeaderScrollHeight={`calc(100vh - 50px - 42px - 20px - 40px ${
              !mdMatches ? '- 50px' : '- 0px'
            })`}
          />
        )}
      </Box>
    </>
  );
}

export default LoiNhuanDisplay;
