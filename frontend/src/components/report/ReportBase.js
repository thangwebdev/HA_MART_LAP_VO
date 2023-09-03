import { Box, Grid, Stack, Switch, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import FilterTimeFromTo from '../filter/FilterTimeFromTo';
import moment from 'moment';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import FilterRadios from '../filter/FilterRadios';
import useResponsive from '~/hooks/useResponsive';
import DrawerBase from '../drawer/DrawerBase';

const concerns = [
  { value: '1', label: 'Thời gian' },
  { value: '2', label: 'Chi nhánh' },
  { value: '3', label: 'Khách hàng' },
  { value: '4', label: 'Kênh bán' },
  { value: '5', label: 'Phương thức thanh toán' },
  { value: '6', label: 'Nhân viên' },
];
const timeTypes = [
  { value: '1', label: 'Tuần này' },
  { value: '2', label: 'Tháng này' },
  { value: '3', label: '6 tháng gần nhất' },
  { value: '4', label: '4 quý gần nhất' },
  { value: '5', label: 'Thời gian tùy chọn' },
];

function ReportBase({ reportCode, report }) {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const { asyncReport } = useApisContext();
  const alertSnackbar = useSnackbarContext();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    timeFrom: moment().startOf('months').format('YYYY-MM-DD'),
    timeTo: moment().format('YYYY-MM-DD'),
  });
  const [isChart, setIsChart] = useState(false);
  const [concern, setConcern] = useState(concerns[0].value);
  const [timeType, setTimeType] = useState(timeTypes[0].value);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);

  const getReport = async (filterData) => {
    try {
      const resp = await asyncReport({
        endpoint: reportCode,
        data: filterData,
      });
      setData(resp);
    } catch (error) {
      alertSnackbar('error', error?.message || 'Server error');
    }
  };

  const renderFilter = () => (
    <Box
      className="custome-scrolly"
      sx={{
        width: '100%',
        height: `calc(100vh - 50px - ${mdMatches ? '42px' : ''} - 20px)`,
        overflow: 'auto',
        padding: '1px',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          marginBottom: '10px',
          borderBottom: '1px dashed #ededed',
        }}
      >
        <Switch
          checked={isChart}
          onChange={(e) => {
            setIsChart(e.target.checked);
          }}
        />
        <Typography sx={{ fontSize: '13px' }}>
          {isChart ? 'Dạng biểu đồ' : 'Dạng bảng'}
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <FilterRadios
          title="Mối quan tâm"
          values={concerns}
          defaultValue={concern}
          onChange={(value) => {
            setConcern(value);
          }}
        />
        {(concern !== '1' || (concern === '1' && timeType === '5')) && (
          <FilterTimeFromTo
            defaultTimeFrom={filter.timeFrom}
            defaultTimeTo={filter.timeTo}
            title="Thời gian"
            onSearch={(time) => {
              setFilter({ ...filter, ...time });
            }}
          />
        )}
        {concern === '1' && (
          <FilterRadios
            title="Giai đoạn"
            values={timeTypes}
            defaultValue={timeType}
            onChange={(value) => {
              setTimeType(value);
            }}
          />
        )}
      </Stack>
    </Box>
  );

  useEffect(() => {
    if (reportCode) {
      const condition = {};
      if (filter.timeFrom) {
        condition.tu_ngay = filter.timeFrom;
      }
      if (filter.timeTo) {
        condition.den_ngay = filter.timeTo;
      }
      condition.type = Number(concern);
      if (concern === '1') {
        condition.time_type = Number(timeType);
      }
      getReport(condition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concern, timeType, filter, reportCode]);

  return (
    <>
      {!mdMatches && (
        <DrawerBase
          title="Điều kiện lọc"
          anchor="left"
          zIndex={1}
          open={openDrawerFilter}
          onClose={() => setOpenDrawerFilter(false)}
        >
          <Box sx={{ width: '80vw', maxWidth: '300px' }}>{renderFilter()}</Box>
        </DrawerBase>
      )}
      <Box sx={{ padding: '10px 0' }}>
        <Grid container spacing="10px" alignItems="flex-start">
          {mdMatches && (
            <Grid item md={2.5}>
              {renderFilter()}
            </Grid>
          )}
          <Grid item xs={12} md={9.5}>
            {report && report.DataDisplay && (
              <report.DataDisplay
                data={data}
                isChart={isChart}
                setOpenDrawerFilter={setOpenDrawerFilter}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ReportBase;
