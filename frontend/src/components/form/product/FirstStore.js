import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { BsCaretDown, BsCaretUp } from 'react-icons/bs';
import TextInput from '~/components/input/TextInput';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';

function FirstStore({ isEdit, tonKhoBanDau, setTonKhoBanDau }) {
  const { asyncGetList } = useApisContext();
  const alertSnackbar = useSnackbarContext();
  const [show, setShow] = useState(true);
  const [khos, setKhos] = useState([]);

  // handle add ton kho ban dau
  const handleAddTonKhobanDau = (tonKhoBanDau) => {
    setTonKhoBanDau((prev) => {
      let prevClone = [...prev];
      prevClone = prevClone.filter(
        (item) => item.ma_kho !== tonKhoBanDau.ma_kho
      );
      prevClone.push(tonKhoBanDau);
      return prevClone;
    });
  };

  const getKhos = async () => {
    try {
      const resp = await asyncGetList('dmkho');
      if (resp) {
        setKhos(resp?.data || []);
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    }
  };

  useEffect(() => {
    if (!isEdit) {
      getKhos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={{ width: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: '5px' }}
      >
        <Stack direction="row" gap="5px">
          <Typography sx={{ fontSize: '13px' }}>Tồn kho ban đầu</Typography>
          <Typography sx={{ fontSize: '13px', opacity: 0.6 }}>
            (tồn kho ban đầu tại các kho)
          </Typography>
        </Stack>
        <IconButton onClick={() => setShow(!show)}>
          {show ? (
            <BsCaretUp fontSize="14px" />
          ) : (
            <BsCaretDown fontSize="14px" />
          )}
        </IconButton>
      </Stack>
      <Collapse in={show}>
        <Box sx={{ padding: '5px' }}>
          <Grid container spacing={2}>
            {isEdit ? (
              <>
                {tonKhoBanDau &&
                  tonKhoBanDau.map((item) => (
                    <Grid key={item.ma_kho} item xs={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography
                            sx={{ fontSize: '13px', fontWeight: 550 }}
                          >
                            {item.ten_kho}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <TextInput
                            disabled
                            type="number"
                            defaultValue={item.ton_kho}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
              </>
            ) : (
              <>
                {khos?.length > 0 &&
                  khos.map((kho) => (
                    <Grid key={kho.ma_kho} item xs={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography
                            sx={{ fontSize: '13px', fontWeight: 550 }}
                          >
                            {kho.ten_kho}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <TextInput
                            type="number"
                            defaultValue={0}
                            onChange={(e) =>
                              handleAddTonKhobanDau({
                                ma_kho: kho.ma_kho,
                                ten_kho: kho.ten_kho,
                                ton_kho: e.target.value,
                              })
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
              </>
            )}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
}

export default FirstStore;
