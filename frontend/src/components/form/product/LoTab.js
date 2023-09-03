import React, { useEffect, memo } from 'react';
import { Stack } from '@mui/material';
import { useState } from 'react';
import TableDisplay from '~/components/table/TableDisplay';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import { formatDateDisplay } from '~/utils/helpers';

const columns = [
  {
    name: 'Mã lô hàng',
    selector: (row) => row.ma_lo,
    width: '120px',
  },
  {
    name: 'Tên lô hàng',
    selector: (row) => row.ten_lo,
    width: '150px',
    wrap: true,
  },
  {
    name: 'Kho',
    selector: (row) => row.ten_kho,
    width: '150px',
    wrap: true,
    center: true,
  },
  {
    name: 'Ngày sản xuất',
    selector: (row) => row.ngay_san_xuat,
    width: '150px',
    center: true,
    format: (row) => formatDateDisplay(row.ngay_san_xuat),
  },

  {
    name: 'Ngày hết hạn',
    selector: (row) => row.han_su_dung,
    minWidth: '120px',
    center: true,
    format: (row) => formatDateDisplay(row.han_su_dung),
  },
];

function LoTab({ maVt }) {
  const { asyncGetList } = useApisContext();
  const alertSnackbar = useSnackbarContext();
  const [los, setLos] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationOption, setPaginationOption] = useState({
    rowsPerPage: 20,
    page: 1,
  });

  const getLos = async () => {
    try {
      setLoading(true);
      const resp = await asyncGetList('dmlo', {
        page: paginationOption.page,
        limit: paginationOption.rowsPerPage,
        ma_vt: maVt,
      });
      if (resp) {
        setLos(resp.data);
        setCount(resp.count);
      }
    } catch (error) {
      alertSnackbar('error', error?.response?.data.message || 'Error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getLos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maVt, paginationOption]);

  return (
    <>
      <Stack sx={{ width: '100%' }} spacing="10px">
        <TableDisplay
          data={los}
          columns={columns}
          title="lô"
          pagination
          paginationTotalRows={count}
          progressPending={loading}
          onChangePage={(page) =>
            setPaginationOption({ ...paginationOption, page })
          }
          onChangeRowsPerPage={(value) =>
            setPaginationOption({ ...paginationOption, rowsPerPage: value })
          }
        />
      </Stack>
    </>
  );
}

export default memo(LoTab);
