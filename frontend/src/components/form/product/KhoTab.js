import React, { useState, memo } from 'react';
import { Stack, Typography } from '@mui/material';
import TableDisplay from '~/components/table/TableDisplay';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import { useEffect } from 'react';
const tkctColumns = [
  {
    name: 'Mã kho',
    selector: (row) => row.ma_kho,
    sortable: true,
    wrap: true,
  },
  {
    name: 'Tên kho',
    selector: (row) => row.ten_kho,
    sortable: true,
    wrap: true,
    center: true,
  },
  {
    name: 'Số lượng tồn',
    selector: (row) => row.ton_kho,
    sortable: true,
    wrap: true,
    right: true,
  },
];
const tkctloColumns = [
  {
    name: 'Mã lô',
    selector: (row) => row.ma_lo,
    sortable: true,
    wrap: true,
  },
  {
    name: 'Tên lô',
    selector: (row) => row.ten_lo,
    sortable: true,
    wrap: true,
    center: true,
  },
  {
    name: 'Tên kho',
    selector: (row) => row.ten_kho,
    sortable: true,
    wrap: true,
    center: true,
  },
  {
    name: 'Số lượng tồn',
    selector: (row) => row.ton_kho,
    sortable: true,
    wrap: true,
    right: true,
  },
];


function KhoTab({ maVt, theoDoiLo }) {
  const { callApi } = useApisContext();
  const alertSnackbar = useSnackbarContext();
  const [tkcts, setTkcts] = useState(null);
  const [tkctLos, setTkctLos] = useState(null);
 
  // get tkcts
  const getTkcts = async () => {
    try {
      const resp = await callApi({
        method: 'post',
        endpoint: '/tonkho/tonchitiet',
        data: {
          ma_vt: maVt,
        },
      });
      if (resp) {
        setTkcts(resp);
      } else {
        setTkcts([]);
      }
    } catch (error) {
      alertSnackbar('error', error?.response?.data?.message);
    }
  };
  // get tkctLos
  const getTkctLos = async () => {
    try {
      const resp = await callApi({
        method: 'post',
        endpoint: '/tonkho/tonchitietlo',
        data: {
          ma_vt: maVt,
        },
      });
      if (resp) {
        setTkctLos(resp);
      } else {
        setTkctLos([]);
      }
    } catch (error) {
      alertSnackbar('error', error?.response?.data?.message);
    }
  };
  useEffect(() => {
    getTkcts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maVt]);
  useEffect(() => {
    if (theoDoiLo) {
      getTkctLos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maVt]);
  
  return (
    <Stack sx={{ width: '100%' }} spacing="20px">
      <Stack spacing="10px">
        <Typography
          sx={{ fontSize: '13px', fontWeight: 550, color: 'secondary.main' }}
        >
          Tồn kho chi tiết
        </Typography>
        <TableDisplay
          data={tkcts || []}
          columns={tkctColumns}
          progressPending={!tkcts}
        />
      </Stack>
      {theoDoiLo && (
        <Stack spacing="10px">
          <Typography
            sx={{ fontSize: '13px', fontWeight: 550, color: 'secondary.main' }}
          >
            Tồn kho chi tiết theo lô
          </Typography>
          <TableDisplay
            data={tkctLos || []}
            columns={tkctloColumns}
            progressPending={!tkctLos}
          />
        </Stack>
      )}
    </Stack>
  );
}

export default memo(KhoTab);
