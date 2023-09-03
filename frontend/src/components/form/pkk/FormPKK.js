import React, { useEffect } from 'react';
import ModalBase from '../../modal/ModalBase';
import ButtonBase from '../../button/ButtonBase';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { Grid } from '@mui/material';
import TextInput from '../../input/TextInput';
import useApisContext from '~/hooks/hookContext/useApisContext';
import { numeralCustom } from '~/utils/helpers';
import moment from 'moment';
import SelectApiInput from '~/components/input/SelectApiInput';
import { dsDanhMuc } from '~/utils/data';

const schema = yup.object({
  kho: yup
    .object()
    .typeError('Vui lòng chọn kho')
    .required('Vui lòng chọn kho'),
  vatTu: yup
    .object()
    .typeError('Vui lòng chọn hàng hóa')
    .required('Vui lòng chọn hàng hóa'),
});

export default function FormPKK({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const { asyncPostData } = useApisContext();
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          kho: {
            ma_kho: defaultValues.ma_kho,
            ten_kho: defaultValues.ten_kho,
          },
          vatTu: {
            ma_vt: defaultValues.ma_vt,
            ten_vt: defaultValues.ten_vt,
            theo_doi_lo: !!defaultValues.ma_lo || false,
          },
          ngay_ct: moment(defaultValues.ngay_ct).format('YYYY-MM-DD'),
          ngay_kiem_hang: moment(defaultValues.ngay_kiem_hang).format(
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
          ngay_kiem_hang: moment().format('YYYY-MM-DD'),
        },

    resolver: yupResolver(schema),
  });
  const tonKhoSoSach = watch('ton_kho_so_sach');
  const tonKhoThucTe = watch('ton_kho_thuc_te');
  const vatTu = watch('vatTu');

  const generateDataPost = (values) => {
    const { vatTu, kho, lo, ...fields } = values;
    const result = {
      ...fields,
      ma_vt: vatTu.ma_vt,
      ten_vt: vatTu.ten_vt,
      ma_kho: kho.ma_kho,
      ten_kho: kho.ten_kho,
      ma_lo: lo?.ma_lo || '',
      ten_lo: lo?.ten_lo || '',
    };
    return result;
  };

  const handleSave = async (values) => {
    const dataPost = generateDataPost(values);
    const method = isEdit ? 'put' : 'post';
    await asyncPostData('dmpkk', dataPost, method).then((resp) => {
      if (!resp.message) {
        handleClose();
        reset();
        setLoad((prev) => prev + 1);
      }
    });
  };
  useEffect(() => {
    const chenhLech = (tonKhoThucTe || 0) - (tonKhoSoSach || 0);
    setValue('chenh_lech', chenhLech);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tonKhoThucTe, tonKhoSoSach]);

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      width="700px"
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} phiếu kiểm kho`}
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
            name="kho"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                disabled={isEdit}
                label="Kho"
                required
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
          <TextInput
            label="Tồn Kho Sổ Sách"
            placeholder="Tồn kho sổ sách"
            type="number"
            name="ton_kho_so_sach"
            register={register}
            errorMessage={errors?.ten_pkk?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            label="Tồn Kho Thực Tế"
            placeholder="Tồn kho thực tế"
            type="number"
            name="ton_kho_thuc_te"
            register={register}
            errorMessage={errors?.ten_pkk?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="chenh_lech"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                disabled
                label="Chênh Lệch"
                type="number"
                value={numeralCustom(value).format()}
                onChange={(e) => {
                  onChange(numeralCustom(e.target.value).value());
                }}
                errorMessage={errors?.chenh_lech?.message}
              />
            )}
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
            label="Ngày Kiểm Hàng"
            type="date"
            placeholder="Ngày kiểm hàng"
            name="ngay_kiem_hang"
            register={register}
            errorMessage={errors?.ngay_kiem_hang?.message}
          />
        </Grid>
        {vatTu?.theo_doi_lo && (
          <Grid item xs={12} md={6}>
            <Controller
              control={control}
              name="lo"
              render={({ field: { value, onChange } }) => (
                <SelectApiInput
                  label="Lô hàng"
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
                  errorMessage={errors?.lo?.message}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
    </ModalBase>
  );
}
