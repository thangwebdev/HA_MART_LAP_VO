import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';

function FilterLPT({ setCondition }) {
  const [filter, setFilter] = useState({
   lpt:'',
  });

  useEffect(() => {
    const condition = {
      $and: [
        {
          $or: [
            {
              ma_loai: {
                $regex: filter.lpt.split(' ').join('.*'),
                $options: 'i',
              },
            },
            {
              ten_loai: {
                $regex: filter.lpt.split(' ').join('.*'),
                $options: 'i',
              },
            },
            { $text: { $search: filter.lpt } },
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
        title="Mã,tên loại phiếu thu"
        onSearch={(value) => setFilter({ ...filter, lpt: value })}
      />

     
    </Stack>
  );
}

export default FilterLPT;
