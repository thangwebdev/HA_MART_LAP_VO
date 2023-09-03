import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { v4 } from 'uuid';
import ButtonBase from '~/components/button/ButtonBase';
import TextInput from '~/components/input/TextInput';
import ModalBase from '~/components/modal/ModalBase';
import * as yup from 'yup';
import moment from 'moment';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectApiInput from '~/components/input/SelectApiInput';
import { dsDanhMuc } from '~/utils/data';
import useApisContext from '~/hooks/hookContext/useApisContext';

const schemaBase = {
  sl_chuyen: yup.number().required('Vui lòng nhập số lượng chuyển'),
  tukho: yup
    .object()
    .typeError('Vui lòng chọn kho')
    .required('Vui lòng chọn kho'),
  denkho: yup
    .object()
    .typeError('Vui lòng chọn kho')
    .required('Vui lòng chọn kho'),
  vatTu: yup
    .object()
    .typeError('Vui lòng chọn hàng hóa')
    .required('Vui lòng chọn hàng hóa'),
};

function FormPXDC({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const [schema, setSchema] = useState(() => yup.object(schemaBase));
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: !!defaultValues
      ? {
          ...defaultValues,
          tukho: defaultValues.ma_kho_tu
            ? {
                ma_kho: defaultValues?.ma_kho_tu,
                ten_kho: defaultValues?.ten_kho_tu,
              }
            : null,
          denkho: defaultValues.ma_kho_den
            ? {
                ma_kho: defaultValues?.ma_kho_den,
                ten_kho: defaultValues?.ten_kho_den,
              }
            : null,
          vatTu: {
            ma_vt: defaultValues.ma_vt,
            ten_vt: defaultValues.ten_vt,
            theo_doi_lo: !!defaultValues.ma_lo || false,
          },
          ngay_ct: moment(defaultValues.ngay_ct).format('YYYY-MM-DD'),
          ngay_xuat_kho: moment(defaultValues.ngay_xuat_kho).format(
            'YYYY-MM-DD'
          ),
          ngay_nhap_kho: moment(defaultValues.ngay_nhap_kho).format(
            'YYYY-MM-DD'
          ),
          lo: defaultValues.ma_lo
            ? {
                ma_lo: defaultValues.ma_lo,
                ten_lo: defaultValues.ten_lo,
              }
            : null,
        }
      : {
          ngay_ct: moment().format('YYYY-MM-DD'),
          ngay_xuat_kho: moment().format('YYYY-MM-DD'),
          ngay_nhap_kho: moment().format('YYYY-MM-DD'),
        },
    resolver: yupResolver(schema),
  });
  console.log(defaultValues);
  const vatTu = watch('vatTu');
  const denKho = watch('denKho');
  const { asyncPostData } = useApisContext();
  const generateDataPost = (values) => {
    const { vatTu, tukho, denkho, tuLo, denLo, ...fields } = values;
    const result = {
      ...fields,
      ma_vt: vatTu.ma_vt,
      ten_vt: vatTu.ten_vt,
      ma_kho_tu: tukho?.ma_kho,
      ten_kho_tu: tukho?.ten_kho,
      ma_kho_den: denkho?.ma_kho,
      ten_kho_den: denkho?.ten_kho,
      ma_lo_tu: tuLo?.ma_lo || '',
      ten_lo_tu: tuLo?.ten_lo || '',
      ma_lo_den: denLo?.ma_lo || '',
      ten_lo_den: denLo?.ten_lo || '',
    };
    return result;
  };

  // handle submit
  const handleSave = async (values) => {
    const method = isEdit ? 'put' : 'post';
    const dataPost = generateDataPost(values);
    await asyncPostData('dmpxdc', dataPost, method).then((resp) => {
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
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} phiếu xuất điều chuyển`}
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
            placeholder="Nhập hoặc tạo tự động"
            name="ma_phieu"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="vatTu"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                disabled={isEdit}
                label="Hàng Hóa"
                required
                apiCode="dmvt"
                placeholder="Kem"
                searchFileds={['ma_vt', 'ten_vt']}
                getOptionLabel={(option) => option.ten_vt}
                selectedValue={value}
                value={value || { ma_vt: '', ten_vt: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc['dmvt'].Form}
                errorMessage={errors?.vatTu?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="tukho"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                label="Từ Kho"
                required
                apiCode="dmkho"
                placeholder="Nơi xuất hàng hóa"
                searchFileds={['ma_kho', 'ten_kho']}
                getOptionLabel={(option) => option.ten_kho}
                selectedValue={value}
                value={value || { ma_kho: '', ten_kho: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc['dmkho'].Form}
                errorMessage={errors?.tukho?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="denkho"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                label="Đến Kho"
                required
                apiCode="dmkho"
                placeholder="Nơi hàng hóa đến"
                searchFileds={['ma_kho', 'ten_kho']}
                getOptionLabel={(option) => option.ten_kho}
                selectedValue={value}
                value={value || { ma_kho: '', ten_kho: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc['dmkho'].Form}
                errorMessage={errors?.denkho?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            type="number"
            label="Số Lượng Chuyển"
            placeholder="Số lượng chuyển"
            name="sl_chuyen"
            register={register}
            required
            errorMessage={errors?.sl_chuyen?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Ngày Chứng Từ"
            type="date"
            placeholder="Ngày chứng từ"
            name="ngay_ct"
            register={register}
            errorMessage={errors?.ngay_ct?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextInput
            label="Ngày Nhập Kho"
            type="date"
            placeholder="Ngày nhập kho"
            name="ngay_nhap_kho"
            register={register}
            errorMessage={errors?.ngay_nhap_kho?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Ngày Xuất Kho"
            type="date"
            placeholder="Ngày xuất kho"
            name="ngay_xuat_kho"
            register={register}
            errorMessage={errors?.ngay_xuat_kho?.message}
          />
        </Grid>
        {vatTu?.theo_doi_lo && (
          <>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="tuLo"
                render={({ field: { value, onChange } }) => (
                  <SelectApiInput
                    label="Từ Lô"
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
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="denLo"
                render={({ field: { value, onChange } }) => (
                  <SelectApiInput
                    label="Đến Lô"
                    required
                    apiCode="dmlo"
                    placeholder="Chọn lô hàng hóa"
                    searchFileds={['ma_lo', 'ten_lo']}
                    condition={
                      !!vatTu
                        ? { ma_vt: vatTu?.ma_vt, ma_kho: denKho.ma_kho }
                        : {}
                    }
                    getOptionLabel={(option) => option.ten_lo}
                    selectedValue={value}
                    value={value || { ma_lo: '', ten_lo: '' }}
                    onSelect={onChange}
                    FormAdd={dsDanhMuc.dmlo.Form}
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>
    </ModalBase>
  );
}

export default FormPXDC;
