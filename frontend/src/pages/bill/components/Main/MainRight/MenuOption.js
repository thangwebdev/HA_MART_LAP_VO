import { MenuItem, Stack, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import MenuBase from '~/components/menu/MenuBase';
import ModalConfirm from '~/components/modal/ModalConfirm';
import DrawerDetail from './DrawerDetail';
import { useBillContext } from '~/pages/bill/Bill';

function MenuOption({ anchorOption, onClose, detail }) {
  const { deleteDetail } = useBillContext();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const handleDeleteDetail = async () => {
    await deleteDetail(detail);
    onClose();
  };

  return (
    <>
      <DrawerDetail
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        detail={detail}
      />
      <ModalConfirm
        title="Xác nhận"
        open={openConfirm}
        handleClose={() => setOpenConfirm(false)}
        onConfirm={handleDeleteDetail}
      >
        <Typography
          sx={{
            fontSize: '13px',
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          Bạn có chắc muốn xóa sản phẩm này không ?
        </Typography>
      </ModalConfirm>
      <MenuBase
        anchorEl={anchorOption}
        open={!!anchorOption}
        handleClose={onClose}
      >
        <Stack>
          <MenuItem
            onClick={() => setOpenDetail(true)}
            sx={{ padding: '5px 10px' }}
          >
            <Stack direction="row" alignItems="center" spacing="10px">
              <BsEye size="14px" />
              <Typography sx={{ fontSize: '13px' }}>Xem chi tiết</Typography>
            </Stack>
          </MenuItem>
          <MenuItem
            onClick={() => setOpenConfirm(true)}
            sx={{
              padding: '5px 10px',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing="10px"
              sx={{ color: 'thirdly.main' }}
            >
              <BiTrash size="14px" style={{ color: 'currentcolor' }} />
              <Typography sx={{ fontSize: '13px', color: 'thirdly.main' }}>
                Xóa
              </Typography>
            </Stack>
          </MenuItem>
        </Stack>
      </MenuBase>
    </>
  );
}

export default MenuOption;
