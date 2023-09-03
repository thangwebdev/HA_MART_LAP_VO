import React from 'react';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { Grid } from '@mui/material';
import useApisContext from '~/hooks/hookContext/useApisContext';
import TextInput from '~/components/input/TextInput';
import SelectApiInput from '~/components/input/SelectApiInput';
import { dsDanhMuc } from '~/utils/data';
import ButtonBase from '~/components/button/ButtonBase';
import ModalBase from '~/components/modal/ModalBase';
import moment from 'moment';

export default function FormLo({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const schema = yup.object({
    ma_lo: yup.string().required('Vui lòng nhập mã lô'),
    ten_lo: yup.string().required('Vui lòng nhập tên lô'),
    kho: yup
      .object()
      .typeError('Vui lòng chọn kho')
      .required('Vui lòng chọn kho'),
    vat_tu: yup
      .object()
      .typeError('Vui lòng chọn hàng hóa')
      .required('Vui lòng chọn hàng hóa'),
  });
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues
      ? {
          ma_lo: defaultValues.ma_lo,
          ten_lo: defaultValues.ten_lo,
          kho: defaultValues.ma_kho
            ? { ma_kho: defaultValues.ma_kho, ten_kho: defaultValues.ten_kho }
            : { ma_kho: '', ten_kho: '' },
          vat_tu: defaultValues.ma_vt
            ? { ma_vt: defaultValues.ma_vt, ten_vt: defaultValues.ten_vt }
            : { ma_vt: '', ten_vt: '' },
          ngay_san_xuat: moment(defaultValues.ngay_san_xuat).format(
            'YYYY-MM-DD'
          ),
          han_su_dung: moment(defaultValues.han_su_dung).format('YYYY-MM-DD'),
        }
      : {},
    resolver: yupResolver(schema),
  });
  const { asyncPostData } = useApisContext();

  const generateDataPost = (values) => {
    const { kho, vat_tu, ...data } = values;
    return {
      ...data,
      ma_kho: kho.ma_kho,
      ten_kho: kho.ten_kho,
      ma_vt: vat_tu.ma_vt,
      ten_vt: vat_tu.ten_vt,
    };
  };

  const handleSave = async (values) => {
    const method = isEdit ? 'put' : 'post';
    const dataPost = generateDataPost(values);
    await asyncPostData('dmlo', dataPost, method).then((resp) => {
      if (!resp.message) {
        handleClose();
        reset();
        setLoad((prev) => prev + 1);
      }
    });
  };

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      width="700px"
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} lô`}
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
            label="Mã lô"
            placeholder="VD: Lo0001"
            name="ma_lo"
            register={register}
            required
            errorMessage={errors?.ma_lo?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Tên lô"
            placeholder="Tên của lô hàng"
            name="ten_lo"
            required
            register={register}
            errorMessage={errors?.ten_lo?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="kho"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                label="Kho"
                required
                apiCode="dmkho"
                placeholder="Kho theo lô"
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
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                label="Hàng hóa"
                required
                apiCode="dmvt"
                placeholder="Hàng hóa theo lô"
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
          <TextInput
            label="Ngày sản xuất"
            type="date"
            placeholder="Ngày sản xuất"
            name="ngay_san_xuat"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Hạn sử dụng"
            type="date"
            placeholder="Hạn sử dụng"
            name="han_su_dung"
            register={register}
          />
        </Grid>
      </Grid>
    </ModalBase>
  );
}
