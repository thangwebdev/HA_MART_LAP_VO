import React from 'react';
import { Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { v4 } from 'uuid';
import ButtonBase from '~/components/button/ButtonBase';
import TextInput from '~/components/input/TextInput';
import ModalBase from '~/components/modal/ModalBase';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useApisContext from '~/hooks/hookContext/useApisContext';
import SelectApiInput from '~/components/input/SelectApiInput';
import moment from 'moment';

const schema = yup.object({
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không đúng định dạng'),
  ten_nv: yup.string().required('Vui lòng nhập tên nhân viên'),
  phan_quyen: yup
    .object()
    .typeError('Vui lòng chọn chức vụ của nhân viên')
    .required('Vui lòng chọn chức vụ của nhân viên'),
});

function FormNhanVien({
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
    control,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          ngay_sinh: defaultValues.ngay_sinh
            ? moment().format('YYYY-MM-DD')
            : null,
          phan_quyen: defaultValues.ma_phan_quyen
            ? {
                ma_phan_quyen: defaultValues.ma_phan_quyen,
                ten_phan_quyen: defaultValues.ten_phan_quyen,
              }
            : null,
        }
      : {},

    resolver: yupResolver(schema),
  });
  const { asyncPostData } = useApisContext();

  const generateDataPost = (values) => {
    const { phan_quyen } = values;
    return {
      ...values,
      ma_phan_quyen: phan_quyen?.ma_phan_quyen,
      ten_phan_quyen: phan_quyen?.ten_phan_quyen,
    };
  };

  // handle submit
  const handleSave = async (values) => {
    const dataPost = generateDataPost(values);
    const method = isEdit ? 'put' : 'post';
    await asyncPostData('dmnv', dataPost, method).then((resp) => {
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
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} nhân viên`}
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
            label="Mã nhân viên"
            placeholder="Nhập hoặc tạo tự động"
            name="ma_nv"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            required
            label="Tên nhân viên"
            placeholder="Tên nhân viên"
            name="ten_nv"
            register={register}
            errorMessage={errors?.ten_nv?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="phan_quyen"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                label="Chức vụ"
                required
                apiCode="dmpq"
                placeholder="Chức vụ"
                searchFileds={['ten_phan_quyen']}
                getOptionLabel={(option) => option.ten_phan_quyen}
                selectedValue={value}
                value={value || { ma_phan_quyen: '', ten_phan_quyen: '' }}
                onSelect={onChange}
                condition={{ ma_phan_quyen: { $ne: 1 } }}
                isOpenDm={false}
                errorMessage={errors?.phan_quyen?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            required
            label="Email"
            placeholder="VD: nhanvien@gmail.com"
            name="email"
            register={register}
            errorMessage={errors?.email?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Ngày sinh"
            type="date"
            placeholder="Tên nhân viên"
            name="ngay_sinh"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Địa chỉ"
            placeholder="Địa chỉ"
            name="dia_chi"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Điện thoại"
            placeholder="Điện thoại"
            name="dien_thoai"
            register={register}
          />
        </Grid>
      </Grid>
    </ModalBase>
  );
}

export default FormNhanVien;
