import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import InputPrice from '../../InputPrice';
import MenuBase from '~/components/menu/MenuBase';
import { numeralCustom } from '~/utils/helpers';
import ModeChietKhau from './ModeChietKhau';
import ButtonBase from '~/components/button/ButtonBase';
import { useBillContext } from '~/pages/bill/Bill';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';

function Price({ defaultValue = 0, detail }) {
  const { pbhSelected, updatePbh } = useBillContext();
  const [anchor, setAnchor] = useState();
  const [isPercent, setIsPercent] = useState(false);
  const [giaTriChietKhau, setGiaTriChietKhau] = useState({
    ty_le_ck: detail.ty_le_ck || 0,
    tien_ck: detail.tien_ck / detail.sl_xuat || 0,
  });

  const handleClose = () => {
    setAnchor(null);
  };

  const handleSaveCk = async () => {
    const pbhClone = cloneDeep(pbhSelected);
    const detailExisted = pbhClone.details.find(
      (item) => item.ma_vt === detail.ma_vt && item.ma_dvt === detail.ma_dvt
    );
    if (detailExisted) {
      detailExisted.ty_le_ck = giaTriChietKhau.ty_le_ck;
      detailExisted.tien_ck = giaTriChietKhau.tien_ck;
    } else {
      return;
    }
    detailExisted.don_gia =
      detailExisted.gia_ban_le -
      (detailExisted.gia_ban_le * detailExisted.ty_le_ck) / 100;
    await updatePbh(pbhClone);
    handleClose();
  };

  const handleGiaTriChietKhauChange = (e) => {
    let value = numeralCustom(e.target.value).value();
    const giaBanLe = detail.gia_ban_le;
    if (isPercent) {
      if (value > 100) {
        value = 100;
      }
      const tienCk = (giaBanLe * value) / 100;
      setGiaTriChietKhau({ ty_le_ck: value, tien_ck: tienCk });
    } else {
      if (value > giaBanLe) {
        value = giaBanLe;
      }
      const tyLeCk = (value * 100) / giaBanLe;
      setGiaTriChietKhau({ ty_le_ck: tyLeCk, tien_ck: value });
    }
  };

  useEffect(() => {
    return () => {
      setGiaTriChietKhau({
        ty_le_ck: detail.ty_le_ck || 0,
        tien_ck: detail.tien_ck / detail.sl_xuat || 0,
      });
    };
  }, [detail, anchor]);

  return (
    <>
      {!!anchor && (
        <MenuBase anchorEl={anchor} open={!!anchor} handleClose={handleClose}>
          <Stack
            sx={{ minWidth: '240px', width: 'auto', padding: '10px' }}
            spacing="5px"
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontSize: '13px' }}>Giá bán lẻ:</Typography>
              <InputPrice
                width="75px"
                readOnly
                textAlign="right"
                value={numeralCustom(detail?.gia_ban_le).format()}
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontSize: '13px' }}>Chiết khấu:</Typography>
              <ModeChietKhau
                onChange={({ isPercent }) => setIsPercent(isPercent)}
              />
              <InputPrice
                width="50px"
                value={numeralCustom(
                  isPercent ? giaTriChietKhau.ty_le_ck : giaTriChietKhau.tien_ck
                ).format()}
                onChange={handleGiaTriChietKhauChange}
                textAlign="right"
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontSize: '13px' }}>Đơn giá:</Typography>
              <InputPrice
                width="75px"
                readOnly
                textAlign="right"
                style={{ fontWeight: 500 }}
                value={numeralCustom(detail?.don_gia).format()}
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing="5px"
              justifyContent="center"
              sx={{ paddingTop: '5px' }}
            >
              <ButtonBase onClick={handleClose} variant="outlined">
                Hủy
              </ButtonBase>
              <ButtonBase onClick={handleSaveCk} variant="contained">
                Lưu
              </ButtonBase>
            </Stack>
          </Stack>
        </MenuBase>
      )}
      <Box onClick={(e) => setAnchor(e.currentTarget)}>
        <InputPrice
          value={numeralCustom(detail?.don_gia).format()}
          width="70px"
          readOnly
        />
      </Box>
    </>
  );
}

export default Price;
