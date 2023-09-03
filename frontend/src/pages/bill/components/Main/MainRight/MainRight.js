import React, { useState } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import TotalLine from './TotalLine';
import styled from 'styled-components';
import ProductLine from './ProductLine';
import { useBillContext } from '~/pages/bill/Bill';
import { numeralCustom } from '~/utils/helpers';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';

const NoteInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  padding: 10px 0;
  font-size: 13px;
  color: #333;
`;

function MainRight() {
  const { pbhSelected, updatePbh, numberProductDiscounted } = useBillContext();
  const [note, setNote] = useState(pbhSelected?.ghi_chu || '');

  const handleNote = async (e) => {
    if (e.key === 'Enter' && note !== pbhSelected?.ghi_chu) {
      const pbhClone = cloneDeep(pbhSelected);
      pbhClone.ghi_chu = note;
      await updatePbh(pbhClone);
    }
  };

  useEffect(() => {
    if (pbhSelected) {
      setNote(pbhSelected?.ghi_chu || '');
    }
  }, [pbhSelected]);

  return (
    <Stack
      spacing="5px"
      justifyContent="space-between"
      sx={{ width: '100%', height: '100%' }}
    >
      <Box
        sx={{
          width: '100%',
          height:
            'calc(100vh - 50px - 50px - 42px - 10px - 10px - 2px  - 130px)',
          overflow: 'auto',
          paddingBottom: '2px',
        }}
        className="hidden-scroll"
      >
        <Stack spacing="5px" sx={{ width: '100%' }}>
          {pbhSelected?.details?.length > 0 ? (
            <>
              {pbhSelected?.details.map((detail, index) => (
                <ProductLine key={index} stt={index + 1} data={detail} />
              ))}
            </>
          ) : (
            <Typography
              sx={{
                fontSize: '13px',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '10px 0',
              }}
            >
              Chưa có sản phẩm
            </Typography>
          )}
        </Stack>
      </Box>
      <Paper sx={{ width: '100%', padding: '10px' }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing="10px"
          sx={{
            position: 'relative',
          }}
        >
          <HiOutlinePencilAlt size="14px" color="#333" />
          <NoteInput
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyUp={handleNote}
            onBlur={() => handleNote({ key: 'Enter' })}
            placeholder="Ghi chú đơn hàng"
          />
        </Stack>
        <Stack
          spacing="5px"
          sx={{ borderTop: '1px dashed #ededed', paddingTop: '5px' }}
        >
          <TotalLine
            text="Tiền hàng"
            length={pbhSelected?.details?.length}
            total={numeralCustom(pbhSelected?.tien_hang).format()}
          />
          <TotalLine
            text="Chiết khấu sản phẩm"
            length={numberProductDiscounted}
            total={numeralCustom(pbhSelected?.tien_ck_sp).format()}
          />
          <TotalLine
            text="Thành tiền"
            total={numeralCustom(pbhSelected?.t_thanh_tien).format()}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default MainRight;
