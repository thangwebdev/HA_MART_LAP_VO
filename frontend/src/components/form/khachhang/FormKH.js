import React from 'react';
import { Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { v4 } from 'uuid';
import ButtonBase from '~/components/button/ButtonBase';
import TextInput from '~/components/input/TextInput';
import ModalBase from '~/components/modal/ModalBase';
import moment from 'moment';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useApisContext from '~/hooks/hookContext/useApisContext';

const schema = yup.object({
  ten_kh: yup.string().required('Vui lòng nhập tên khách hàng'),
  sdt: yup.string().required('Vui lòng nhập số điện thoại'),
});
  
function FormKH({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues ?{
        ...defaultValues,
        ngay_sinh: moment(defaultValues.ngay_sinh).format('YYYY-MM-DD'),
    }: {
      ngay_sinh: moment().format('YYYY-MM-DD'),
    }
,
    resolver: yupResolver(schema),
  });
  const { asyncPostData } = useApisContext();

  // handle submit
  const handleSave = async (values) => {
    const method = isEdit ? 'put' : 'post';
    await asyncPostData('dmkh', values, method).then((resp) => {
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
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} Khách hàng`}
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
            label="Tên Khách Hàng"
            placeholder="VD: Triều Tiên"
            name="ten_kh"
            register={register}
            required
            errorMessage={errors?.ten_kh?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            disabled={isEdit}
            label="Số điện thoại"
            placeholder="VD: 01694187654"
            name="sdt"
            register={register}
            required
            errorMessage={errors?.sdt?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Địa Chỉ"
            placeholder="VD: Quận 9"
            name="dia_chi"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            type="date"
            label="Ngày Sinh"
            name="ngay_sinh"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Email"
            placeholder="VD: ntt@gmail.com"
            name="email"
            register={register}
          />
        </Grid>
      </Grid>
    </ModalBase>
  );
}

export default FormKH;
