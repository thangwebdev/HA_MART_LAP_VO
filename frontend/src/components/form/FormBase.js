import { Box, Grid } from '@mui/material';
import React from 'react';
import { v4 } from 'uuid';

function FormBase({ fields = [], errors = {}, register = () => {} }) {
  return (
    <Box sx={{ width: '100%' }} component="form">
      <Grid container spacing={2}>
        {fields.map(({ Input, ...inputProps }) => (
          <Grid key={v4()} item xs={12} md={6}>
            <Input
              {...inputProps}
              register={register}
              errorMessage={errors[inputProps.name]?.message}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default FormBase;
