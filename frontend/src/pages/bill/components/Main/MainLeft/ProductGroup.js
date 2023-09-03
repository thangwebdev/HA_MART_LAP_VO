import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import useApisContext from '~/hooks/hookContext/useApisContext';
import { useEffect } from 'react';

function ProductGroup({ maNvt, setMaNvt }) {
  const alertSnackbar = useSnackbarContext();
  const { asyncGetList } = useApisContext();
  const [groups, setGroups] = useState([]);
  const getProductGroups = async () => {
    try {
      const resp = await asyncGetList('dmnvt');
      setGroups(resp.data);
    } catch (error) {
      alertSnackbar('error', error?.messge || 'Inernal server error');
    }
  };

  useEffect(() => {
    getProductGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        height: '46px',
        padding: '5px',
        borderBottom: '1px dashed #ededed',
      }}
    >
      <Swiper
        slidesPerView="auto"
        spaceBetween={10}
        grabCursor
        pagination={{ clickable: true, el: '.pagination-group-product' }}
      >
        <SwiperSlide style={{ width: 'fit-content', padding: '2px 0' }}>
          <ProductGroupItem
            isActive={maNvt === ''}
            onClick={() => setMaNvt('')}
          >
            Tất cả
          </ProductGroupItem>
        </SwiperSlide>
        {groups.map((group) => (
          <SwiperSlide
            style={{ width: 'fit-content', padding: '2px 0' }}
            key={group.ma_nvt}
          >
            <ProductGroupItem
              isActive={maNvt === group.ma_nvt}
              onClick={() => setMaNvt(group.ma_nvt)}
            >
              {group.ten_nvt}
            </ProductGroupItem>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default ProductGroup;

function ProductGroupItem({ children, isActive, onClick }) {
  return (
    <Paper
      onClick={onClick}
      sx={{
        padding: '8px 12px',
        fontSize: '13px',
        cursor: 'pointer',
        borderRadius: '20px',
        transition: 'all linear 0.1s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isActive ? 'primary.main' : '#fff',
        color: isActive ? '#fff' : '',
        '&:hover': { backgroundColor: 'primary.main', color: '#fff' },
      }}
    >
      {children}
    </Paper>
  );
}
