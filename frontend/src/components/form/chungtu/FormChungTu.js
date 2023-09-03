import { Grid } from '@mui/material';
import React from 'react';
import ModalBase from '~/components/modal/ModalBase';
import ButtonBase from '~/components/button/ButtonBase';
import { v4 } from 'uuid';
import { FiSave } from 'react-icons/fi';
import TextInput from '~/components/input/TextInput';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useApisContext from '~/hooks/hookContext/useApisContext';
import { useForm } from 'react-hook-form';

export default function FormChungTu({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const schema = yup.object({
    ma_ct: yup.string().required('Vui lòng nhập mã chứng từ'),
    ten_ct: yup.string().required('Vui lòng nhập tên chứng từ'),
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
    await asyncPostData('dmct', values, method).then((resp) => {
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
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} chứng từ`}
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
            label="Mã chứng từ"
            placeholder="VD: pnk"
            name="ma_ct"
            register={register}
            required
            errorMessage={errors?.ma_ct?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Tên chứng từ"
            placeholder="Tên gọi của chưng từ"
            name="ten_ct"
            register={register}
            required
            errorMessage={errors?.ten_ct?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Diễn giải"
            placeholder="Giải thích nội dung chứng từ"
            name="dien_giai"
            register={register}
          />
        </Grid>
      </Grid>
    </ModalBase>
  );
}
