import React from 'react';
import ModalBase from '../../modal/ModalBase';
import ButtonBase from '../../button/ButtonBase';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { Grid } from '@mui/material';
import TextInput from '../../input/TextInput';
import useApisContext from '~/hooks/hookContext/useApisContext';

export default function FormDVT({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const schema = yup.object({
    ma_dvt: yup.string().required('Vui lòng nhập mã đơn vị tính'),
    ten_dvt: yup.string().required('Vui lòng nhập tên đơn vị tính'),
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
    await asyncPostData('dmdvt', values, method).then((resp) => {
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
        <Grid item xs={12} md={6}>
          <TextInput
            disabled={isEdit}
            label="Mã đơn vị tính"
            placeholder="VD: Chai"
            name="ma_dvt"
            register={register}
            required
            errorMessage={errors?.ma_dvt?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Tên đơn vị tính"
            placeholder="Chai"
            name="ten_dvt"
            required
            register={register}
            errorMessage={errors?.ten_dvt?.message}
          />
        </Grid>
      </Grid>
    </ModalBase>
  );
}
