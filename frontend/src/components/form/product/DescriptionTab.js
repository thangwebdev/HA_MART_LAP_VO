import React from 'react';
import { Box } from '@mui/material';
import AreaInput from '~/components/input/AreaInput';

function DescriptionTab({ register }) {
  return (
    <Box>
      <AreaInput
        register={register}
        name="mo_ta"
        placeholder="Mô tả chi tiết hàng hóa"
      />
    </Box>
  );
}

export default DescriptionTab;
