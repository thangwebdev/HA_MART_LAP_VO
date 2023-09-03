import { Grid, Stack } from '@mui/material';
import React, { memo } from 'react';
import ButtonBase from '~/components/button/ButtonBase';
import TableDisplay from '~/components/table/TableDisplay';
import { numeralCustom } from '~/utils/helpers';
import { BsPlusCircle } from 'react-icons/bs';
import ModalBase from '~/components/modal/ModalBase';
import { FiSave } from 'react-icons/fi';
import { v4 } from 'uuid';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import TextInput from '~/components/input/TextInput';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import { cloneDeep } from 'lodash';
import SelectApiInput from '~/components/input/SelectApiInput';
import { dsDanhMuc } from '~/utils/data';

const columns = [
  {
    name: 'Mã',
    selector: (row) => row.ma_dvt,
    left: true,
    sortable: true,
  },
  {
    name: 'Tên',
    selector: (row) => row.ten_dvt,
    left: true,
    sortable: true,
  },
  {
    name: 'Số lượng quy đổi',
    selector: (row) => row.sl_quy_doi,
    center: true,
  },
  {
    name: 'Giá bán quy đổi',
    selector: (row) => row.gia_ban_qd,
    format: (row) => numeralCustom(row.gia_ban_qd).format(),
    center: true,
  },
  {
    name: 'Mã vạch',
    selector: (row) => row.barcode,
    right: true,
    sortable: true,
  },
];

function DvtVariant({ dvts, setDvts }) {
  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [defaultValue, setDefaultValue] = useState(null);
  const alertSnackbar = useSnackbarContext();

  const addDvt = (dvt, isEdit) => {
    if (isEdit) {
      const index = dvts.findIndex((item) => item.ma_dvt === dvt.ma_dvt);
      if (index >= 0) {
        const dvtsCoypy = cloneDeep(dvts);
        dvtsCoypy.splice(index, 1, dvt);
        setDvts(dvtsCoypy);
      }
    } else {
      const existed = dvts.find((item) => item.ma_dvt === dvt.ma_dvt);
      if (existed) {
        alertSnackbar('error', `Đơn vị tính '${existed.ten_dvt}' đã tồn tại`);
        return;
      } else {
        setDvts((prev) => [{ ...dvt }, ...prev]);
      }
    }
  };
  // handle row clicked
  const handleRowClicked = (data) => {
    setDefaultValue(data);
    setIsEdit(true);
    setOpenForm(true);
  };
  // handle delete
  const handleDelete = (data) => {
    let dvtsCoypy = cloneDeep(dvts);
    dvtsCoypy = dvtsCoypy.filter(
      (item) => (item.id || item._id) !== (data.id || data._id)
    );
    setDvts(dvtsCoypy);
  };

  return (
    <>
      {openForm && (
        <FormDvt
          open={openForm}
          handleClose={() => {
            setOpenForm(false);
            setIsEdit(false);
            setDefaultValue(null);
          }}
          isEdit={isEdit}
          addDvt={addDvt}
          defaultValue={defaultValue}
        />
      )}
      <Stack spacing="5px" alignItems="flex-end">
        <ButtonBase
          variant="outlined"
          startIcon={<BsPlusCircle style={{ fontSize: '14px' }} />}
          onClick={() => setOpenForm(true)}
        >
          Thêm đơn vị tính
        </ButtonBase>
        <TableDisplay
          title="đơn vị tính khác"
          columns={columns}
          data={dvts || []}
          onRowClicked={handleRowClicked}
          handleDelete={handleDelete}
          uniqueKey={'ten_dvt'}
        />
      </Stack>
    </>
  );
}

export default memo(DvtVariant);

const schema = yup.object({
  don_vi_tinh: yup
    .object()
    .typeError('Vui lòng nhập tên đơn vị tính')
    .required('Vui lòng nhập tên đơn vị tính'),
  sl_quy_doi: yup
    .number()
    .typeError('Số lượng phải là số')
    .required('Vui lòng nhập số lượng quy đổi'),
  gia_ban_qd: yup
    .number()
    .typeError('Giá bán phải là số')
    .required('Vui lòng nhập giá bán quy đổi'),
});

function FormDvt({ open, handleClose, isEdit, addDvt, defaultValue = {} }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: defaultValue
      ? {
          ...defaultValue,
          don_vi_tinh: defaultValue.ma_dvt
            ? {
                ma_dvt: defaultValue.ma_dvt,
                ten_dvt: defaultValue.ten_dvt,
              }
            : null,
        }
      : {},
  });

  const generateDataAdd = (values) => {
    const { don_vi_tinh, ...fields } = values;
    return {
      ...fields,
      ma_dvt: don_vi_tinh.ma_dvt,
      ten_dvt: don_vi_tinh.ten_dvt,
    };
  };

  // handle save
  const handleSave = (values) => {
    const dataAdd = generateDataAdd(values);
    addDvt(dataAdd, isEdit);
    handleClose();
  };

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      width="300px"
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} đơn vị tính`}
      actions={[
        <ButtonBase
          key={v4()}
          onClick={handleSubmit(handleSave)}
          loading={isSubmitting}
          startIcon={<FiSave style={{ fontSize: '16px' }} />}
        >
          Lưu
        </ButtonBase>,
        <ButtonBase key={v4()} variant="outlined" onClick={handleClose}>
          Hủy
        </ButtonBase>,
      ]}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="don_vi_tinh"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                label="Đơn vị tính"
                apiCode="dmdvt"
                placeholder="Đơn vị tính"
                searchFileds={['ma_dvt', 'ten_dvt']}
                getOptionLabel={(option) => option.ten_dvt}
                selectedValue={value}
                value={value || { ma_dvt: '', ten_dvt: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc['dmdvt'].Form}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            type="number"
            register={register}
            name="sl_quy_doi"
            label="Số lượng quy đổi"
            required
            errorMessage={errors?.sl_quy_doi?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="gia_ban_qd"
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={numeralCustom(value).format()}
                onChange={(e) =>
                  onChange(numeralCustom(e.target.value).value())
                }
                label="Giá bán"
                required
                errorMessage={errors?.gia_ban_qd?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
         
              <TextInput
                name='barcode'
                register={register}
                label="Mã vạch"
              />
           
        </Grid>
      </Grid>
    </ModalBase>
  );
}
