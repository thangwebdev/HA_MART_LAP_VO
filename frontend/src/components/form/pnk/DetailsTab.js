import React from 'react';
import { Stack } from '@mui/material';
import TableDisplay from '~/components/table/TableDisplay';
import { numeralCustom } from '~/utils/helpers';
import ButtonBase from '~/components/button/ButtonBase';
import { BsPlusCircle } from 'react-icons/bs';
import { useState } from 'react';
import FormAddDetail from './FormAddDetail';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import { cloneDeep } from 'lodash';

const columns = [
  {
    name: 'Mã hàng',
    selector: (row) => row.ma_vt,
    width: '120px',
  },
  {
    name: 'Tên hàng',
    selector: (row) => row.ten_vt,
    width: '200px',
    wrap: true,
  },
  {
    name: 'Số lượng',
    selector: (row) => row.so_luong_nhap,
    width: '100px',
    center: true,
  },
  {
    name: 'Giá vốn',
    selector: (row) => row.gia_von,
    width: '150px',
    center: true,
    format: (row) => numeralCustom(row.gia_von).format(),
  },
  {
    name: 'Tiền nhập',
    selector: (row) => row.tien_nhap,
    minWidth: '150px',
    center: true,
    format: (row) => numeralCustom(row.tien_nhap).format(),
  },
  {
    name: 'Đơn vị tính',
    selector: (row) => row.ten_dvt,
    minWidth: '100px',
    center: true,
  },
];

function DetailsTab({ details, setDetails, isEditMaster }) {
  const [openForm, setOpenForm] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const alertSnackbar = useSnackbarContext();

  // add a detail
  const addDetail = (detail, isEdit = false) => {
    const { vat_tu, don_vi_tinh, lo, ...detailValue } = detail;
    if (!isEdit) {
      const existed = details.find((item) => item.ma_vt === vat_tu.ma_vt);
      if (existed) {
        alertSnackbar(
          'error',
          `Hàng hóa '${vat_tu.ma_vt}' đã tồn tại trong chi tiết`
        );
        return;
      }
    }
    const detailData = {
      ...detailValue,
      ma_vt: vat_tu.ma_vt,
      ten_vt: vat_tu.ten_vt,
      ma_dvt: don_vi_tinh.ma_dvt,
      ten_dvt: don_vi_tinh.ten_dvt,
    };
    if (lo) {
      detailData.ma_lo = lo.ma_lo;
      detailData.ten_lo = lo.ten_lo;
    }
    if (isEdit) {
      const index = details.findIndex((item) => item.ma_vt === vat_tu.ma_vt);
      if (index >= 0) {
        const detailsCopy = cloneDeep(details);
        detailsCopy.splice(index, 1, detailData);
        setDetails(detailsCopy);
      }
    } else {
      setDetails([...details, detailData]);
    }
  };
  // delete detail
  const handleDeleteDetail = (row) => {
    let detailsCopy = cloneDeep(details);
    detailsCopy = detailsCopy.filter((item) => item.ma_vt !== row.ma_vt);
    setDetails(detailsCopy);
  };

  // click on row
  const handleRowClicked = (row) => {
    setDefaultValues(row);
    setOpenForm(true);
    setIsEdit(true);
  };
  // handle close form
  const handleCloseForm = () => {
    setIsEdit(false);
    setDefaultValues(null);
    setOpenForm(false);
  };

  return (
    <>
      {openForm && (
        <FormAddDetail
          open={openForm}
          handleClose={handleCloseForm}
          addDetail={addDetail}
          defaultValues={defaultValues}
          isEdit={isEdit}
          isEditMaster={isEditMaster}
        />
      )}
      <Stack sx={{ width: '100%' }} spacing="10px">
        {!isEditMaster && (
          <Stack
            direction="row"
            spacing="5px"
            alignItems="center"
            justifyContent="flex-end"
          >
            <ButtonBase
              variant="outlined"
              startIcon={<BsPlusCircle style={{ fontSize: '14px' }} />}
              onClick={() => setOpenForm(true)}
            >
              Thêm dòng
            </ButtonBase>
          </Stack>
        )}
        <TableDisplay
          data={details}
          columns={columns}
          onRowClicked={handleRowClicked}
          handleDelete={isEditMaster ? null : handleDeleteDetail}
          uniqueKey="ma_vt"
        />
      </Stack>
    </>
  );
}

export default DetailsTab;
