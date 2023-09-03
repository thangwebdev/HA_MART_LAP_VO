import React, { memo } from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import ButtonBase from '~/components/button/ButtonBase';
import { BsCaretLeft, BsCaretRight, BsPlusCircle } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { useBillContext } from '../../Bill';
import './style.css';
import { useState } from 'react';
import ModalConfirm from '~/components/modal/ModalConfirm';
import useResponsive from '~/hooks/useResponsive';

function ListBill() {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const smMatches = useResponsive({ matchKey: 'up', breakpoint: 'sm' });
  const { pbhs, pbhSelected, createPbh, setPbhSelected, updatePbh } =
    useBillContext();
  const [openConfirm, setOpenConFirm] = useState(false);

  const handleDeleteBill = async () => {
    const pbhDelete = {
      ...pbhSelected,
      ma_trang_thai: 3,
      ten_trang_thai: 'Hủy',
    };
    await updatePbh(pbhDelete);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing="5px"
      sx={{ marginLeft: mdMatches ? '20px' : 0 }}
    >
      <ModalConfirm
        open={openConfirm}
        title="Xác nhận"
        handleClose={() => setOpenConFirm(false)}
        onConfirm={handleDeleteBill}
      >
        <Typography
          sx={{ fontSize: '13px', fontStyle: 'italic', textAlign: 'center' }}
        >
          Bạn có chắc muốn xóa hóa đơn này không ?
        </Typography>
      </ModalConfirm>
      <Tooltip placement="top" arrow title="Thêm hóa đơn">
        <IconButton onClick={createPbh}>
          <BsPlusCircle size="14px" />
        </IconButton>
      </Tooltip>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          width: smMatches ? '252px' : '146px',
          height: '34px',
          position: 'relative',
          padding: pbhs?.length > 2 ? '0 20px' : '0',
        }}
      >
        <Swiper
          style={{ width: '100%' }}
          slidesPerView={smMatches ? 2 : 1}
          spaceBetween={5}
          grabCursor
          navigation={{
            prevEl: '.btn-prev-bill',
            nextEl: '.btn-next-bill',
            disabledClass: 'disable-btn',
          }}
          modules={[Navigation]}
        >
          {pbhs.map((pbh, index) => (
            <SwiperSlide key={pbh.ma_phieu} style={{ width: 'fit-content' }}>
              <ButtonBase
                onClick={() => setPbhSelected(pbh)}
                sx={{ width: '100%', height: '30px' }}
                endIcon={
                  pbh.ma_phieu === pbhSelected?.ma_phieu && pbhs?.length > 1 ? (
                    <Tooltip title="Hủy" placement="top" arrow>
                      <Box onClick={() => setOpenConFirm(true)}>
                        <MdClose size="12px" />
                      </Box>
                    </Tooltip>
                  ) : null
                }
                variant={
                  pbh.ma_phieu === pbhSelected?.ma_phieu
                    ? 'contained'
                    : 'outlined'
                }
              >
                Hóa đơn {index + 1}
              </ButtonBase>
            </SwiperSlide>
          ))}
        </Swiper>
        <IconButton
          sx={{
            display: pbhs.length > (smMatches ? 2 : 1) ? 'inline-flex' : 'none',
            position: 'absolute',
            top: '50%',
            left: '0px',
            transform: 'translate(-40%, -50%)',
          }}
          className="btn-prev-bill"
        >
          <BsCaretLeft size="14px" />
        </IconButton>
        <IconButton
          sx={{
            display: pbhs.length > (smMatches ? 2 : 1) ? 'inline-flex' : 'none',
            position: 'absolute',
            top: '50%',
            right: '0px',
            transform: 'translate(40%, -50%)',
          }}
          className="btn-next-bill"
        >
          <BsCaretRight size="14px" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default memo(ListBill);
