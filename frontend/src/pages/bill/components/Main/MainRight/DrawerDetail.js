import React, { useEffect, useState, useMemo } from 'react';
import { TabPanel } from '@mui/lab';
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material';
import DrawerBase from '~/components/drawer/DrawerBase';
import TabsBase from '~/components/tabs/TabsBase';
import ChangeNumber from './ChangeNumber';
import ProductImage from '~/assets/img/product.png';
import { PUBLIC_URL } from '~/utils/constants';
import { numeralCustom } from '~/utils/helpers';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import useApisContext from '~/hooks/hookContext/useApisContext';
import TableDisplay from '~/components/table/TableDisplay';
import useResponsive from '~/hooks/useResponsive';

const tonKhoColumns = [
  { name: 'Mã kho', selector: (row) => row.ma_kho, left: true },
  { name: 'Tên kho', selector: (row) => row.ten_kho, center: true, wrap: true },
  { name: 'Tồn kho', selector: (row) => row.ton_kho, right: true },
];

function DrawerDetail({ open, onClose = () => {}, detail }) {
  const smMatches = useResponsive({ matchKey: 'up', breakpoint: 'sm' });
  const alertSnackbar = useSnackbarContext();
  const { asyncGetList, callApi } = useApisContext();
  const [vatTu, setVatTu] = useState();
  const [tonKhoChiTiet, setTonKhoChiTiet] = useState([]);

  // tong ton kho
  const tongTonKho = useMemo(() => {
    return tonKhoChiTiet.reduce((acc, item) => {
      return acc + item.ton_kho;
    }, 0);
  }, [tonKhoChiTiet]);

  // get vat tu
  const getVatTu = async () => {
    try {
      const resp = await asyncGetList('dmvt', { ma_vt: detail.ma_vt });
      if (resp && resp.data.length > 0) {
        setVatTu(resp.data[0]);
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    }
  };

  // lay ton kho chi tiet
  const getTonKhoChiTiet = async () => {
    try {
      const resp = await callApi({
        endpoint: '/tonkho/tonchitiet',
        data: { ma_vt: detail.ma_vt },
      });
      setTonKhoChiTiet(resp);
    } catch (error) {
      alertSnackbar(error?.message || 'Internal server error');
    }
  };

  useEffect(() => {
    getVatTu();
    getTonKhoChiTiet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  return (
    <DrawerBase
      open={open}
      onClose={onClose}
      anchor="left"
      title={`${vatTu?.ten_vt} - (${vatTu?.ma_vt})`}
    >
      <Box
        className="hidden-scroll"
        sx={{
          width: '80vw',
          maxWidth: '450px',
          height: '100%',
          overflow: 'auto',
        }}
      >
        <TabsBase
          tabLabels={[
            { label: 'Thông tin chung', value: '1' },
            { label: 'Mô tả', value: '2' },
            { label: 'Tồn kho', value: '3' },
          ]}
        >
          <TabPanel sx={{ padding: '10px 0' }} value="1">
            <Grid container spacing="10px">
              <Grid item xs={12} sm={4}>
                <Box
                  sx={
                    smMatches
                      ? {
                          width: '100%',
                          paddingTop: '100%',
                          position: 'relative',
                        }
                      : {
                          width: '100px',
                          height: '100px',
                          margin: '0 auto',
                          position: 'relative'
                        }
                  }
                >
                  <Avatar
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '4px',
                    }}
                    src={
                      detail?.hinh_anh
                        ? `${PUBLIC_URL}/${detail?.hinh_anh}`
                        : ProductImage
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Stack sx={{ width: '100%' }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing="20px"
                    sx={{
                      padding: '10px 0',
                      borderBottom: '1px solid',
                      borderColor: 'whitish.gray',
                    }}
                  >
                    <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                      Giá bán :
                    </Typography>
                    <Typography sx={{ fontSize: '13px' }}>
                      {numeralCustom(detail.don_gia).format()}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing="20px"
                    sx={{
                      padding: '10px 0',
                      borderBottom: '1px solid',
                      borderColor: 'whitish.gray',
                    }}
                  >
                    <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                      Số lượng :
                    </Typography>
                    <ChangeNumber detail={detail} />
                    <Typography
                      sx={{ fontSize: '13px', color: 'primary.main' }}
                    >
                      Tồn: {tongTonKho} {vatTu?.ten_dvt}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing="20px"
                    sx={{
                      padding: '10px 0',
                      borderBottom: '1px solid',
                      borderColor: 'whitish.gray',
                    }}
                  >
                    <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                      Xuất xứ :
                    </Typography>
                    <Typography sx={{ fontSize: '13px' }}>
                      {vatTu?.xuat_xu}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing="20px"
                    sx={{
                      padding: '10px 0',
                      borderBottom: '1px solid',
                      borderColor: 'whitish.gray',
                    }}
                  >
                    <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                      Vị trí :
                    </Typography>
                    <Typography sx={{ fontSize: '13px' }}>
                      {vatTu?.vi_tri}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel sx={{ padding: '10px 0' }} value="2">
            <Box sx={{ width: '100%', height: '100%' }}>
              {vatTu?.mo_ta ? (
                <Typography sx={{ fontSize: '13px' }}>{vatTu.mo_ta}</Typography>
              ) : (
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: '13px',
                    fontStyle: 'italic',
                  }}
                >
                  Không có dữ liệu
                </Typography>
              )}
            </Box>
          </TabPanel>
          <TabPanel sx={{ padding: '10px 0' }} value="3">
            <Box sx={{ width: '100%', height: '100%' }}>
              {tonKhoChiTiet?.length > 0 ? (
                <TableDisplay data={tonKhoChiTiet} columns={tonKhoColumns} />
              ) : (
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: '13px',
                    fontStyle: 'italic',
                  }}
                >
                  Không có dữ liệu
                </Typography>
              )}
            </Box>
          </TabPanel>
        </TabsBase>
      </Box>
    </DrawerBase>
  );
}

export default DrawerDetail;
