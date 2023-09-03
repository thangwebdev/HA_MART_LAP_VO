import {
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import ChangeNumber from './ChangeNumber';
import Price from './Price';
import InputPrice from '../../InputPrice';
import { numeralCustom } from '~/utils/helpers';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { useState } from 'react';
import MenuOption from './MenuOption';

function ProductLine({ data, stt = 1 }) {
  const [anchorOption, setAnchorOption] = useState();

  return (
    <Paper sx={{ padding: '5px 8px' }}>
      {!!anchorOption && (
        <MenuOption
          detail={data}
          anchorOption={anchorOption}
          onClose={() => setAnchorOption(null)}
        />
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing="10px">
          <Typography sx={{ fontSize: '13px' }}>{stt}.</Typography>
          <Typography sx={{ fontSize: '13px' }}>
            {data?.ten_vt} - ({data?.ma_vt})
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing="5px"
        >
          {data?.ten_dvt && (
            <Box
              sx={{
                padding: '5px 8px',
                borderRadius: '20px',
                backgroundColor: 'primary.opacity',
                fontSize: '12px',
                color: 'primary.main',
              }}
            >
              {data?.ten_dvt}
            </Box>
          )}
          <IconButton
            size="small"
            onClick={(e) => setAnchorOption(e.currentTarget)}
          >
            <BiDotsVerticalRounded size="14px" />
          </IconButton>
        </Stack>
      </Stack>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Price detail={data} />
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <ChangeNumber detail={data} />
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Box>
              <InputPrice
                value={numeralCustom(data?.tien_hang).format()}
                readOnly
                width="80px"
                textAlign="right"
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProductLine;
