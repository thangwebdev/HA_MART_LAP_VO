import { IconButton, Stack } from '@mui/material';
import React from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import InputPrice from '../../InputPrice';
import { useBillContext } from '~/pages/bill/Bill';
import { useState } from 'react';
import { useEffect } from 'react';

function ChangeNumber({ detail }) {
  const { add } = useBillContext();
  const [number, setNumber] = useState(detail?.sl_xuat || 1);

  const handleNumberChange = (e) => {
    let value = e.target.value;
    if (isNaN(value)) {
      return;
    } else {
      setNumber(Number(value));
    }
  };

  const handleUpdateNumber = (e) => {
    if (e.key === 'Enter') {
      if (detail.sl_xuat !== number) {
        add({
          product: detail,
          plus: false,
          sl: Number(number),
          dvt: { ...detail },
        });
      }
    }
  };

  useEffect(() => {
    setNumber(detail?.sl_xuat);
  }, [detail]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing="2px"
      sx={{
        '& .action': {
          visibility: 'hidden',
        },
        '&:hover .action': {
          visibility: 'unset',
        },
      }}
    >
      <IconButton
        className="action"
        disabled={detail?.sl_xuat === 1}
        onClick={() => {
          add({ product: detail, sl: -1, dvt: { ...detail } });
        }}
      >
        <AiOutlineMinusCircle size="14px" />
      </IconButton>
      <InputPrice
        value={number}
        onKeyUp={handleUpdateNumber}
        onBlur={() => handleUpdateNumber({ key: 'Enter' })}
        onChange={handleNumberChange}
      />
      <IconButton
        className="action"
        onClick={() => {
          add({ product: detail, sl: 1, dvt: { ...detail } });
        }}
      >
        <AiOutlinePlusCircle size="14px" />
      </IconButton>
    </Stack>
  );
}

export default ChangeNumber;
