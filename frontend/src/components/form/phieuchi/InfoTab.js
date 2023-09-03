import React from 'react';
import { Grid } from '@mui/material';
import { Controller} from 'react-hook-form';
import TextInput from '~/components/input/TextInput';
import SelectApiInput from '~/components/input/SelectApiInput';
import { dsDanhMuc } from '~/utils/data';
import { numeralCustom } from '~/utils/helpers';


function InfoTab({ register, control, errors,nhomNguoiNhan,isEdit }){
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
          name="nhom_nguoi_nhan"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Nhóm Người Nhận"
              required
              apiCode="dmnnnh"
              placeholder="Khách Hàng"
              searchFileds={['ma_nhom_nguoi_nhan', 'ten_nhom_nguoi_nhan']}
              getOptionLabel={(option) => option.ten_nhom_nguoi_nhan}
              selectedValue={value}
              value={
                value || { ma_nhom_nguoi_nhan: '', ten_nhom_nguoi_nhan: '' }
              }
              onSelect={onChange}
              FormAdd={dsDanhMuc['dmnnnh'].Form}
              errorMessage={errors?.nhom_nguoi_nhan?.message}
            />
          )}
        />
      </Grid>
      {nhomNguoiNhan?.ma_nhom_nguoi_nhan === 'ncc' && (
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="nguoi_nhan"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                label="Tên Người Nhận"
                required
                apiCode="dmncc"
                placeholder="Tiên"
                searchFileds={['ma_ncc', 'ten_ncc']}
                getOptionLabel={(option) => option.ten_ncc}
                selectedValue={value}
                value={value || { ma_ncc: '', ten_ncc: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc['dmncc'].Form}
                errorMessage={errors?.nguoi_nhan?.message}
              />
            )}
          />
        </Grid>
      )}
      {nhomNguoiNhan?.ma_nhom_nguoi_nhan === 'nv' && (
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="nguoi_nhan"
            render={({ field: { onChange, value } }) => (
              <SelectApiInput
                label="Tên Người Nhận"
                required
                apiCode="dmnv"
                placeholder="Tiên"
                searchFileds={['ma_nv', 'ten_nv']}
                getOptionLabel={(option) => option.ten_nv }
                selectedValue={value}
                value={value || { ma_nv: '', ten_nv: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc['dmnv'].Form}
                errorMessage={errors?.nguoi_nhan?.message}
              />
            )}
          />
        </Grid>
      )}
      {nhomNguoiNhan?.ma_nhom_nguoi_nhan === 'khac' && (
        <Grid item xs={12} md={6}>
          <TextInput
            label="Tên Người Nộp"
            name="nguoi_nhan"
            register={register}
            required
            errorMessage={errors?.nguoi_nhan?.message}
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
          name="loai_phieu_chi"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Loại phiếu chi"
              required
              apiCode="dmlpc"
              placeholder="chi tiền khác hàng"
              searchFileds={['ma_loai', 'ten_loai']}
              getOptionLabel={(option) => option.ten_loai}
              selectedValue={value}
              value={value || { ma_loai: '', ten_loai: '' }}
              onSelect={onChange}
              FormAdd={dsDanhMuc['dmlpc'].Form}
              errorMessage={errors?.loai_phieu_chi?.message}
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
