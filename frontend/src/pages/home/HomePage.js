import React from 'react';
import AdminLayout from '~/components/layouts/AdminLayout';
import { Avatar, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ResultSellToday from './components/ResultSellToday';
import DoanhSoToday from './components/DoanhSoToday';
import CustomersToday from './components/CustomersToday';
import PaymentIcon from '~/assets/img/iconPayment.png';
import useResponsive from '~/hooks/useResponsive';

function HomePage() {
  const matches = useResponsive({ matchKey: 'up', breakpoint: 'md' });

  return (
    <AdminLayout>
      <Grid
        container
        spacing="10px"
        sx={{
          padding: '10px 0',
          alignItems: 'stretch',
          height: matches ? 'calc(100vh - 50px - 42px)' : 'calc(100vh - 50px)',
        }}
      >
        <Grid
          className="hidden-scroll"
          item
          xs={12}
          md={9}
          sx={{ height: '100%', overflow: 'auto', paddingRight: '5px' }}
        >
          <LeftColumn>
            <ResultSellToday />
            <DoanhSoToday />
            <CustomersToday />
          </LeftColumn>
        </Grid>
        {!!matches && (
          <Grid item xs={0} md={3} sx={{ height: '100%' }}>
            <RightColumn>
              <Stack
                direction="row"
                sx={{
                  paddingBottom: '10px',
                  borderBottom: '1px solid #ededed',
                }}
              >
                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                  Các hoạt động gần đây
                </Typography>
              </Stack>
              <Stack
                spacing={'10px'}
                className="custome-scrolly"
                sx={{
                  maxHeight: 'calc(100vh - 50px - 42px - 10px - 20px - 32px)',
                  overflow: 'auto',
                  padding: '5px 5px 5px 0',
                }}
              >
                {Array(2)
                  .fill(0)
                  .map((item, index) => (
                    <Stack key={index} spacing={1}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                        sx={{
                          backgroundColor:
                            index === 0 ? 'secondary.fif' : '#ededed',
                          padding: '5px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'secondary.fif',
                          },
                        }}
                      >
                        <Avatar
                          src={PaymentIcon}
                          sx={{ width: 40, height: 40, borderRadius: 0 }}
                        />
                        <Box>
                          <Typography sx={{ fontSize: '12px' }}>
                            <Typography
                              component="span"
                              sx={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: 'secondary.main',
                              }}
                            >
                              Ngọc Ánh - Kinh Doanh
                            </Typography>
                            <Typography
                              component="span"
                              sx={{ fontSize: '12px' }}
                            >
                              {' '}
                              vừa
                            </Typography>
                            <Typography
                              component="span"
                              sx={{ fontSize: '12px', color: 'secondary.main' }}
                            >
                              {' '}
                              bán đơn hàng
                            </Typography>
                            <Typography
                              component="span"
                              sx={{ fontSize: '12px' }}
                            >
                              {' '}
                              với giá trị
                            </Typography>
                            <Typography
                              component="span"
                              sx={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: 'secondary.main',
                              }}
                            >
                              {' '}
                              150.000
                            </Typography>
                          </Typography>
                          <Typography sx={{ fontSize: '10px', color: 'gray' }}>
                            5 phút trước
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  ))}
              </Stack>
            </RightColumn>
          </Grid>
        )}
      </Grid>
    </AdminLayout>
  );
}

export default HomePage;

const LeftColumn = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  height: 'auto',
  paddingBottom: '2px',
}));

const RightColumn = styled(Paper)(() => ({
  width: '100%',
  padding: '10px 5px 10px 10px',
}));
