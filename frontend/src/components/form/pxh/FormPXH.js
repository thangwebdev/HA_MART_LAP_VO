import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { FiSave } from 'react-icons/fi';
import { v4 } from 'uuid';
import ButtonBase from '~/components/button/ButtonBase';
import TextInput from '~/components/input/TextInput';
import ModalBase from '~/components/modal/ModalBase';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectApiInput from '~/components/input/SelectApiInput';
import { dsDanhMuc } from '~/utils/data';
import { numeralCustom } from '~/utils/helpers';
import moment from 'moment';
import useApisContext from '~/hooks/hookContext/useApisContext';

const schemaBase = {
  kho: yup
    .object()
    .typeError('Vui lòng chọn kho')
    .required('Vui lòng chọn kho'),
  vat_tu: yup
    .object()
    .typeError('Vui lòng chọn hàng hóa')
    .required('Vui lòng chọn hàng hóa'),
  ngay_ct: yup.date().required('Vui lòng chọn ngày chứng từ'),
  ngay_huy_hang: yup.date().required('Vui lòng chọn ngày hủy hàng'),
  sl_huy: yup.number().required('Vui lòng nhập số lượng hủy'),
};

function FormPXH({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const { asyncPostData } = useApisContext();
  const [schema, setSchema] = useState(yup.object(schemaBase));
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          kho: defaultValues.ma_kho
            ? { ma_kho: defaultValues.ma_kho, ten_kho: defaultValues.ten_kho }
            : null,
          vat_tu: defaultValues.ma_vt
            ? { ma_vt: defaultValues.ma_vt, ten_vt: defaultValues.ten_vt }
            : null,
          ngay_ct: moment(defaultValues.ngay_ct).format('YYYY-MM-DD'),
          ngay_huy_hang: moment(defaultValues.ngay_huy_hang).format(
            'YYYY-MM-DD'
          ),
        }
      : {
          ngay_ct: moment().format('YYYY-MM-DD'),
          ngay_huy_hang: moment().format('YYYY-MM-DD'),
        },
  });
  // generate data post
  const generateDatePost = (values) => {
    const { kho, vat_tu, ...fields } = values;
    return {
      ...fields,
      ma_kho: kho.ma_kho,
      ten_kho: kho.ten_kho,
      ma_vt: vat_tu.ma_vt,
      ten_vt: vat_tu.ten_vt,
    };
  };
  // handle save
  const handleSave = async (values) => {
    const dataPost = generateDatePost(values);
    const method = isEdit ? 'put' : 'post';
    await asyncPostData('dmpxh', dataPost, method);
    handleClose();
    setLoad((prev) => prev + 1);
  };

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      width="700px"
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} phiếu xuất hủy`}
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
          <TextInput
            disabled={isEdit}
            label="Mã Phiếu"
            placeholder="Nhập hoạc tạo tự động"
            name="ma_phieu"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="kho"
            render={({ field: { value, onChange } }) => (
              <SelectApiInput
                required
                label="Kho"
                apiCode="dmkho"
                placeholder="Kho"
                searchFileds={['ma_kho', 'ten_kho']}
                getOptionLabel={(option) => option.ten_kho}
                selectedValue={value}
                value={value || { ma_kho: '', ten_kho: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc['dmkho'].Form}
                errorMessage={errors?.kho?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="vat_tu"
            render={({ field: { value, onChange } }) => (
              <SelectApiInput
                required
                label="Hàng hóa"
                apiCode="dmvt"
                placeholder="Hàng hóa"
                searchFileds={['ma_vt', 'ten_vt']}
                getOptionLabel={(option) => option.ten_vt}
                selectedValue={value}
                value={value || { ma_vt: '', ten_vt: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc['dmvt'].Form}
                errorMessage={errors?.vat_tu?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="sl_huy"
            render={({ field: { value, onChange } }) => (
              <TextInput
                label="Số lượng hủy"
                type="text"
                required
                value={numeralCustom(value).format()}
                onChange={(e) =>
                  onChange(numeralCustom(e.target.value).value())
                }
                errorMessage={errors?.sl_huy?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Ngày chứng từ"
            type="date"
            required
            name="ngay_ct"
            register={register}
            errorMessage={errors?.ngay_ct?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Ngày hủy hàng"
            type="date"
            required
            name="ngay_huy_hang"
            register={register}
            errorMessage={errors?.ngay_huy_hang?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="gia_tri_huy"
            render={({ field: { value, onChange } }) => (
              <TextInput
                label="Giá trị hủy"
                type="text"
                value={numeralCustom(value).format()}
                onChange={(e) =>
                  onChange(numeralCustom(e.target.value).value())
                }
                errorMessage={errors?.sl_huy?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </ModalBase>
  );
}

export default FormPXH;
