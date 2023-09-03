import { Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import TextInput from '~/components/input/TextInput';

function DinhMucTonTab({ register }) {
  return (
    <Paper
      sx={{
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextInput
            type="number"
            label="Tồn tối thiểu"
            placeholder="Mức tồn tối thiểu"
            name="ton_toi_thieu"
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            type="number"
            label="Tồn tối đa"
            placeholder="Mức tồn tối đa"
            name="ton_toi_da"
            register={register}
          />
        </Grid>
      </Grid>
      <Typography
        sx={{ fontSize: '13px', color: 'primary.main', fontStyle: 'italic' }}
      >
        Cung cấp định mức tồn để hệ thống cảnh báo hàng tồn kho
      </Typography>
    </Paper>
  );
}

export default DinhMucTonTab;
