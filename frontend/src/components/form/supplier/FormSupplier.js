import React from 'react';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { Grid } from '@mui/material';
import useApisContext from '~/hooks/hookContext/useApisContext';
import ModalBase from '~/components/modal/ModalBase';
import ButtonBase from '~/components/button/ButtonBase';
import TextInput from '~/components/input/TextInput';

const schema = yup.object({
  ma_ncc: yup.string().required('Vui lòng nhập mã nhà cung cấp'),
  ten_ncc: yup.string().required('Vui lòng nhập tên nhà cung cấp'),
  email: yup.string().email('Email không đúng định dạng')
});

export default function FormSupplier({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
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
    await asyncPostData('dmncc', values, method).then((resp) => {
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
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} nhà cung cấp`}
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
            label="Mã nhà cung cấp"
            placeholder="VD: NCC_001"
            name="ma_ncc"
            register={register}
            required
            errorMessage={errors?.ma_ncc?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Tên nhà cung cấp"
            placeholder="Tên đơn vị cung cấp hàng hóa"
            name="ten_ncc"
            required
            register={register}
            errorMessage={errors?.ten_ncc?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Địa chỉ"
            placeholder="Địa chỉ nhà cung cấp"
            name="dia_chi"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Điện thoại"
            placeholder="Số liên hệ với nhà cung cấp"
            name="dien_thoai"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Email"
            placeholder="VD: ncc@gmail.com"
            name="email"
            register={register}
            errorMessage={errors?.email?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Fax"
            name="fax"
            register={register}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            label="Thông tin thêm"
            name="thong_tin_them"
            register={register}
          />
        </Grid>
      </Grid>
    </ModalBase>
  );
}
