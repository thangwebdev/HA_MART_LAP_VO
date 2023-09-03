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
          placeholder="VD: PXK0001"
          name="ma_phieu"
          register={register}
          required
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
              placeholder="Kho xuất"
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
          required
          type="date"
          label="Ngày xuất hàng"
          placeholder="Ngày hàng xuất kho"
          name="ngay_ct"
          register={register}
          errorMessage={errors?.ngay_ct?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          required
          type="date"
          label="Ngày chứng từ"
          placeholder="Ngày chứng từ"
          name="ngay_ct"
          register={register}
          errorMessage={errors?.ngay_ct?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="tong_tien_xuat"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(val);
              }}
              label="Tổng tiền xuất"
              placeholder="Tiền xuất hàng"
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default InfoTab;
