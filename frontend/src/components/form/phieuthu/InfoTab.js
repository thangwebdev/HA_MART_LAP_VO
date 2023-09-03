import React from 'react';
import { Grid } from '@mui/material';
import { Controller} from 'react-hook-form';
import TextInput from '~/components/input/TextInput';
import SelectApiInput from '~/components/input/SelectApiInput';
import { dsDanhMuc } from '~/utils/data';
import { numeralCustom } from '~/utils/helpers';


function InfoTab({ register, control, errors, nhomNguoiNop, isEdit }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextInput
          disabled={isEdit}
          label="Mã phiếu"
          placeholder="Mã nhập hoặc tạo tự động"
          name="ma_phieu"
          register={register}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="nhom_nguoi_nop"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Nhóm Người Nộp"
              required
              apiCode="dmnnn"
              placeholder="Khách Hàng"
              searchFileds={['ma_nhom_nguoi_nop', 'ten_nhom_nguoi_nop']}
              getOptionLabel={(option) => option.ten_nhom_nguoi_nop}
              selectedValue={value}
              value={value || { ma_nhom_nguoi_nop: '', ten_nhom_nguoi_nop: '' }}
              onSelect={onChange}
              FormAdd={dsDanhMuc['dmnnn'].Form}
              errorMessage={errors?.nhom_nguoi_nop?.message}
            />
          )}
        />
      </Grid>
      {nhomNguoiNop?.ma_nhom_nguoi_nop === 'ncc' && (
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="nguoi_nop"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                label="Tên Người Nộp"
                required
                apiCode="dmncc"
                placeholder="Tiên"
                searchFileds={['ma_ncc', 'ten_ncc']}
                getOptionLabel={(option) => option.ten_ncc}
                selectedValue={value}
                value={value || { ma_ncc: '', ten_ncc: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc['dmncc'].Form}
                errorMessage={errors?.nguoi_nop?.message}
              />
            )}
          />
        </Grid>
      )}
      {nhomNguoiNop?.ma_nhom_nguoi_nop === 'kh' && (
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="nguoi_nop"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                label="Tên Người Nộp"
                required
                apiCode="dmkh"
                placeholder="Tiên"
                searchFileds={['ma_kh', 'ten_kh']}
                getOptionLabel={(option) => option.ten_kh}
                selectedValue={value}
                value={value || { ma_kh: '', ten_kh: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc['dmkh'].Form}
                errorMessage={errors?.nguoi_nop?.message}
              />
            )}
          />
        </Grid>
      )}
      {nhomNguoiNop?.ma_nhom_nguoi_nop === 'khac' && (
        <Grid item xs={12} md={6}>
          <TextInput
            label="Tên Người Nộp"
            name="nguoi_nop"
            register={register}
            required
            errorMessage={errors?.nguoi_nop?.message}
          />
        </Grid>
      )}

      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="kho"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
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
          name="loai_phieu_thu"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Loại phiếu thu"
              required
              apiCode="dmlpt"
              placeholder="Thu tiền khác hàng"
              searchFileds={['ma_loai', 'ten_loai']}
              getOptionLabel={(option) => option.ten_loai}
              selectedValue={value}
              value={value || { ma_loai: '', ten_loai: '' }}
              onSelect={onChange}
              FormAdd={dsDanhMuc['dmlpt'].Form}
              errorMessage={errors?.loai_phieu_thu?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="gia_tri"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(val);
              }}
              label="Giá Trị"
              required
              placeholder="Giá trị"
              errorMessage={errors?.gia_tri?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="phuong_thuc_thanh_toan"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Phương thức thanh toán"
              apiCode="dmpttt"
              placeholder="Tiền mặt"
              searchFileds={['ma_pttt', 'ten_pttt']}
              getOptionLabel={(option) => option.ten_pttt}
              selectedValue={value}
              value={value || { ma_pttt: '', ten_pttt: '' }}
              onSelect={onChange}
              FormAdd={dsDanhMuc['dmpttt'].Form}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          type="date"
          label="Ngày lập phiếu"
          name="ngay_lap_phieu"
          register={register}
          required
          errorMessage={errors?.ngay_lap_phieu?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          type="date"
          label="Ngày chứng từ"
          name="ngay_ct"
          register={register}
          required
          errorMessage={errors?.ngay_ct?.message}
        />
      </Grid>
    </Grid>
  );
}

  


export default InfoTab;
