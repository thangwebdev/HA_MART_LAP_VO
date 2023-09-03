import { Box, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import BarChart from '~/components/chart/BarChart';
import TableDisplay from '~/components/table/TableDisplay';
import { numeralCustom } from '~/utils/helpers';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import useResponsive from '~/hooks/useResponsive';
import { BiFilterAlt } from 'react-icons/bi';

const columns = [
  {
    name: 'Nhóm / thời gian',
    selector: (row) => row.label,
    left: true,
    minWidth: '180px',
    wrap: true
  },
  {
    name: 'Doanh thu',
    center: true,
    minWidth: '180px',
    wrap: true,
    selector: (row) => row.doanh_thu,
    format: (row) => numeralCustom(row.doanh_thu).format(),
  },
  {
    name: 'Doanh thu thuần',
    right: true,
    minWidth: '180px',
    wrap: true,
    selector: (row) => row.doanh_thu_thuan,
    format: (row) => numeralCustom(row.doanh_thu_thuan).format(),
  },
];

function DoanhThuDisplay({ data, isChart, setOpenDrawerFilter = () => {} }) {
  const theme = useTheme();
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });

  const labels = useMemo(() => {
    return (data.data || []).map((item) => item.label);
  }, [data]);
  const dataChart1 = useMemo(() => {
    return (data.data || []).map((item) => item.doanh_thu);
  }, [data]);
  const dataChart2 = useMemo(() => {
    return (data.data || []).map((item) => item.doanh_thu_thuan);
  }, [data]);
  const tongDoanhThu = useMemo(() => {
    return (data.data || []).reduce((acc, item) => {
      return acc + item.doanh_thu;
    }, 0);
  }, [data]);

  const tongDoanhThuThuan = useMemo(() => {
    return (data.data || []).reduce((acc, item) => {
      return acc + item.doanh_thu_thuan;
    }, 0);
  }, [data]);

  // render total
  const renderTotal = () => (
    <Stack
      direction={mdMatches ? 'row' : 'column'}
      alignItems={mdMatches ? 'center' : 'flex-start'}
      justifyContent={mdMatches ? 'flex-end' : 'center'}
      spacing={mdMatches ? 2 : 0}
      sx={mdMatches ? { flex: 1 } : {}}
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
          Tổng doanh thu: {numeralCustom(tongDoanhThu).format()}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" gap="5px">
        <Box
          sx={{
            width: 20,
            height: 10,
            backgroundColor: 'primary.main',
          }}
        ></Box>
        <Typography sx={{ fontSize: '13px' }}>
          Tổng doanh thu thuần:
          {numeralCustom(tongDoanhThuThuan).format()}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Stack direction="row" alignItems="center">
        <Typography
          sx={{ fontSize: '20px', fontWeight: 500, marginBottom: '10px' }}
        >
          Báo cáo doanh thu
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
                label: 'Doanh thu',
                backgroundColor: theme.palette.secondary.main,
                data: dataChart1,
              },
              {
                label: 'Doanh thu thuần',
                backgroundColor: theme.palette.primary.main,
                data: dataChart2,
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

export default DoanhThuDisplay;
