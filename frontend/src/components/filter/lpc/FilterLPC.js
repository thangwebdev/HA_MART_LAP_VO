import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';

function FilterLPC({ setCondition }) {
  const [filter, setFilter] = useState({
   lpc:'',
  });

  useEffect(() => {
    const condition = {
      $and: [
        {
          $or: [
            {
              ma_loai: {
                $regex: filter.lpc.split(' ').join('.*'),
                $options: 'i',
              },
            },
            {
              ten_loai: {
                $regex: filter.lpc.split(' ').join('.*'),
                $options: 'i',
              },
            },
            { $text: { $search: filter.lpc } },
          ],
        },
      ],
     
    };
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã,tên loại phiếu chi"
        onSearch={(value) => setFilter({ ...filter, lpc: value })}
      />

     
    </Stack>
  );
}

export default FilterLPC;
