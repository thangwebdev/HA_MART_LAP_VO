import { Grid } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import SelectApiInput from '~/components/input/SelectApiInput';
import TextInput from '~/components/input/TextInput';
import { dsDanhMuc } from '~/utils/data';
import { numeralCustom } from '~/utils/helpers';

function InfoTab({ register, control, isEdit, errors }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextInput
          disabled={isEdit}
          label="Mã phiếu"
          placeholder='Nhập hoặc tạo tự động'
          name="ma_phieu"
          register={register}
          errorMessage={errors?.ma_phieu?.message}
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
              placeholder="Kho nhập"
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
        <TextInput
          type="date"
          label="Ngày chứng từ"
          placeholder="Ngày hiệu lực sổ sách"
          name="ngay_ct"
          register={register}
          errorMessage={errors?.ngay_ct?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          type="date"
          label="Ngày nhập hàng"
          placeholder="Ngày hàng vào kho"
          name="ngay_nhap_hang"
          register={register}
          errorMessage={errors?.ngay_nhap_hang?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="nha_cung_cap"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Nhà cung cấp"
              apiCode="dmncc"
              placeholder="Nhà cung cấp"
              searchFileds={['ma_ncc', 'ten_ncc']}
              getOptionLabel={(option) => option.ten_ncc}
              selectedValue={value}
              value={value || { ma_ncc: '', ten_ncc: '' }}
              onSelect={onChange}
              FormAdd={dsDanhMuc['dmncc'].Form}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="tong_tien_nhap"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(val);
              }}
              label="Tổng tiền nhập"
              placeholder="Tiền nhập hàng"
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default InfoTab;
