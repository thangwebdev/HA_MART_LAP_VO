import { Grid } from '@mui/material';
import React from 'react';
import ModalBase from '../../modal/ModalBase';
import ButtonBase from '../../button/ButtonBase';
import { v4 } from 'uuid';
import { FiSave } from 'react-icons/fi';
import TextInput from '../../input/TextInput';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useApisContext from '~/hooks/hookContext/useApisContext';
import { useForm } from 'react-hook-form';

export default function FormKho({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const schema = yup.object({
    ma_kho: yup.string().required('Vui lòng nhập mã kho'),
    ten_kho: yup.string().required('Vui lòng nhập tên kho'),
    email: yup.string().email('Email không đúng định dạng'),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });
  const { asyncPostData } = useApisContext();

  const handleSave = async (values) => {
    const method = isEdit ? 'put' : 'post';
    await asyncPostData('dmkho', values, method).then((resp) => {
      if (!resp?.message) {
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
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} kho`}
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
            label="Mã kho"
            placeholder="kcty"
            name="ma_kho"
            register={register}
            required
            errorMessage={errors?.ma_kho?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Tên kho"
            placeholder="kcty"
            name="ten_kho"
            register={register}
            required
            errorMessage={errors?.ten_kho?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Địa chỉ"
            placeholder="Địa điểm kho"
            name="dia_chi"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Email"
            placeholder="email"
            name="email"
            register={register}
            errorMessage={errors.email?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Điện thoại"
            placeholder="Số điện thoại"
            name="dien_thoai"
            register={register}
          />
        </Grid>
      </Grid>
    </ModalBase>
  );
}
