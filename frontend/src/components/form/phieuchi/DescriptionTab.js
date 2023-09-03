import React from 'react';
import { Box } from '@mui/material';
import AreaInput from '~/components/input/AreaInput';

function DescriptionTab({ register }) {
  return (
    <Box>
      <AreaInput
        register={register}
        name="dien_giai"
        placeholder="Mô tả chi tiết phiếu"
      />
    </Box>
  );
}

export default DescriptionTab;
