import React from 'react';
import ModalBase from '../../modal/ModalBase';
import ButtonBase from '../../button/ButtonBase';
import useApisContext from '~/hooks/hookContext/useApisContext';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { v4 } from 'uuid';
import { Grid } from '@mui/material';
import TextInput from '../../input/TextInput';
import { yupResolver } from '@hookform/resolvers/yup';

export default function FormNVT({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const schema = yup.object({
    ma_nvt: yup.string().required('Vui lòng nhập mã nhóm vật tư'),
    ten_nvt: yup.string().required('Vui lòng nhập tên nhóm vật tư'),
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
    await asyncPostData('dmnvt', values, method).then((resp) => {
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
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} nhóm vật tư`}
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
            label="Mã nhóm vật tư"
            placeholder="VD: NVT001"
            name="ma_nvt"
            register={register}
            required
            errorMessage={errors?.ma_nvt?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Tên nhóm vật tư"
            placeholder="Dầu gội"
            name="ten_nvt"
            required
            register={register}
            errorMessage={errors?.ten_nvt?.message}
          />
        </Grid>
      </Grid>
    </ModalBase>
  );
}
