import { Grid } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { v4 } from 'uuid';
import ButtonBase from '~/components/button/ButtonBase';
import SelectApiInput from '~/components/input/SelectApiInput';
import TextInput from '~/components/input/TextInput';
import ModalBase from '~/components/modal/ModalBase';
import { dsDanhMuc } from '~/utils/data';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { numeralCustom } from '~/utils/helpers';

const baseSchema = {
  vat_tu: yup
    .object()
    .typeError('Vui lòng chọn hàng hóa')
    .required('Vui lòng chọn hàng hóa'),
  don_vi_tinh: yup
    .object()
    .typeError('Hàng hóa chưa có đơn vị tính')
    .required('Hàng hóa chưa có đơn vị tính'),
  gia_von: yup
    .number()
    .typeError('Giá vốn phải là số')
    .required('Vui lòng nhập giá vốn'),
  so_luong_nhap: yup
    .number()
    .typeError('Số lượng phải là số')
    .required('Vui lòng nhập số lượng'),
  tien_nhap: yup
    .number()
    .typeError('Tiền nhập phải là số')
    .required('Vui lòng nhập tiền nhập'),
};

function FormAddDetail({
  open,
  handleClose,
  isEdit,
  isEditMaster,
  addDetail,
  defaultValues,
}) {
  const [schema, setSchema] = useState(yup.object(baseSchema));
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          vat_tu: defaultValues.ma_vt
            ? {
                ma_vt: defaultValues.ma_vt,
                ten_vt: defaultValues.ten_vt,
                ma_dvt: defaultValues.ma_dvt,
                ten_dvt: defaultValues.ten_dvt,
                theo_doi_lo: !!defaultValues.ma_lo,
              }
            : null,
          lo: defaultValues.ma_lo
            ? { ma_lo: defaultValues.ma_lo, ten_lo: defaultValues.ten_lo }
            : null,
        }
      : {},
  });
  const vatTu = watch('vat_tu');
  const soLuongNhap = watch('so_luong_nhap');
  const giaVon = watch('gia_von');

  useEffect(() => {
    if (vatTu) {
      setValue('don_vi_tinh', {
        ma_dvt: vatTu.ma_dvt || '',
        ten_dvt: vatTu.ten_dvt || '',
      });
      if (vatTu.theo_doi_lo) {
        setSchema(
          yup.object({
            ...baseSchema,
            lo: yup
              .object()
              .typeError('Chọn lô hàng hóa')
              .required('Chọn lô hàng hóa'),
          })
        );
      } else {
        setSchema(yup.object(baseSchema));
      }
    } else {
      setValue('don_vi_tinh', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vatTu]);
  useEffect(() => {
    const tienNhap = (soLuongNhap || 0) * (giaVon || 0);
    setValue('tien_nhap', tienNhap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soLuongNhap, giaVon]);

  const handleSave = (values) => {
    return new Promise((resovle) => {
      setTimeout(() => {
        addDetail(values, isEdit);
        handleClose();
        resovle();
      }, 200);
    });
  };

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      width="600px"
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} Chi tiết`}
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
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="vat_tu"
            render={({ field: { value, onChange } }) => (
              <SelectApiInput
                disabled={isEdit}
                label="Hàng hóa"
                required
                apiCode="dmvt"
                placeholder="Hàng nhập kho"
                searchFileds={['ma_vt', 'ten_vt']}
                getOptionLabel={(option) => option.ten_vt}
                selectedValue={value}
                value={value || { ma_vt: '', ten_vt: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc.dmvt.Form}
                errorMessage={errors?.vat_tu?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="don_vi_tinh"
            render={({ field: { value, onChange } }) => (
              <SelectApiInput
                disabled
                label="Đơn vị tính"
                required
                apiCode="dmdvt"
                placeholder="Đơn vị tính"
                searchFileds={['ma_dvt', 'ten_dvt']}
                getOptionLabel={(option) => option.ten_dvt}
                selectedValue={value}
                value={value || { ma_dvt: '', ten_dvt: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc.dmdvt.Form}
                errorMessage={errors?.don_vi_tinh?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="gia_von"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                required
                label="Giá vốn"
                value={numeralCustom(value).format()}
                onChange={(e) => {
                  onChange(numeralCustom(e.target.value).value());
                }}
                errorMessage={errors?.gia_von?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="so_luong_nhap"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                required
                label="Số lượng nhập"
                value={numeralCustom(value).format()}
                onChange={(e) => {
                  onChange(numeralCustom(e.target.value).value());
                }}
                errorMessage={errors?.so_luong_nhap?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="tien_nhap"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                required
                label="Tiền nhập"
                value={numeralCustom(value).format()}
                onChange={(e) => {
                  onChange(numeralCustom(e.target.value).value());
                }}
                errorMessage={errors?.tien_nhap?.message}
              />
            )}
          />
        </Grid>
        {vatTu?.theo_doi_lo && (
          <Grid item xs={12} md={6}>
            <Controller
              control={control}
              name="lo"
              render={({ field: { value, onChange } }) => (
                <SelectApiInput
                  label="Lô hàng"
                  required
                  apiCode="dmlo"
                  placeholder="Chọn lô hàng hóa"
                  searchFileds={['ma_lo', 'ten_lo']}
                  condition={!!vatTu ? { ma_vt: vatTu?.ma_vt } : {}}
                  getOptionLabel={(option) => option.ten_lo}
                  selectedValue={value}
                  value={value || { ma_lo: '', ten_lo: '' }}
                  onSelect={onChange}
                  FormAdd={dsDanhMuc.dmlo.Form}
                  errorMessage={errors?.lo?.message}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
    </ModalBase>
  );
}

export default FormAddDetail;
