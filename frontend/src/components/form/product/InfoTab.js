import React, { useState, memo } from 'react';
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import TextInput from '~/components/input/TextInput';
import { Controller } from 'react-hook-form';
import SelectApiInput from '~/components/input/SelectApiInput';
import { numeralCustom } from '~/utils/helpers';
import { dsDanhMuc } from '~/utils/data';
import { BsCaretDown, BsCaretUp } from 'react-icons/bs';
import DvtVariant from './DvtVariant';
import FirstStore from './FirstStore';

function InfoTab({
  control,
  register,
  errors,
  isEdit = false,
  dvts,
  setDvts,
  tonKhoBanDau,
  setTonKhoBanDau,
}) {
  const [showDvts, setShowDvts] = useState(true);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextInput
          disabled={isEdit}
          label="Mã hàng hóa"
          placeholder="Nhập hoặc tạo tự động"
          name="ma_vt"
          register={register}
          errorMessage={errors?.ma_vt?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          label="Tên hàng hóa"
          placeholder="Tên nhận dạng"
          name="ten_vt"
          required
          register={register}
          errorMessage={errors?.ten_vt?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          label="Mã vạch"
          placeholder="13 ký tự số"
          name="barcode"
          register={register}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          placeholder="Tên ngắn gọn"
          label="Tên tắt"
          name="ten_tat"
          register={register}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="nhom_vat_tu"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Nhóm vật tư"
              apiCode="dmnvt"
              placeholder="Nhóm vật tư"
              searchFileds={['ma_nvt', 'ten_nvt']}
              getOptionLabel={(option) => option.ten_nvt}
              selectedValue={value}
              value={value || { ma_nvt: '', ten_nvt: '' }}
              onSelect={onChange}
              FormAdd={dsDanhMuc['dmnvt'].Form}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="don_vi_tinh"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Đơn vị tính"
              apiCode="dmdvt"
              placeholder="Đơn vị tính"
              searchFileds={['ma_dvt', 'ten_dvt']}
              getOptionLabel={(option) => option.ten_dvt}
              selectedValue={value}
              value={value || { ma_dvt: '', ten_dvt: '' }}
              onSelect={onChange}
              FormAdd={dsDanhMuc['dmdvt'].Form}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="gia_ban_le"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Giá bán lẻ"
              placeholder="Giá bán 1 đơn vị hàng hóa"
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const number = e.target.value;
                onChange(numeralCustom(number).value());
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="gia_von"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Giá vốn"
              placeholder="Giá vốn trung bình"
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const number = e.target.value;
                onChange(numeralCustom(number).value());
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          label="Xuất xứ"
          placeholder="VD: Việt Nam"
          name="xuat_xu"
          register={register}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          label="Vị trí"
          placeholder="Chỗ đặt trong kho"
          name="vi_tri"
          register={register}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ width: '100%' }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ padding: '5px' }}
          >
            <Typography sx={{ fontSize: '13px' }}>Đơn vị tính khác</Typography>
            <IconButton onClick={() => setShowDvts(!showDvts)}>
              {showDvts ? (
                <BsCaretUp fontSize="14px" />
              ) : (
                <BsCaretDown fontSize="14px" />
              )}
            </IconButton>
          </Stack>
          <Collapse in={showDvts}>
            <Box sx={{ padding: '5px' }}>
              <DvtVariant dvts={dvts} setDvts={setDvts} />
            </Box>
          </Collapse>
        </Paper>
      </Grid>
      {!isEdit && (
        <Grid item xs={12}>
          <FirstStore
            isEdit={isEdit}
            tonKhoBanDau={tonKhoBanDau}
            setTonKhoBanDau={setTonKhoBanDau}
          />
        </Grid>
      )}
    </Grid>
  );
}

export default memo(InfoTab);
