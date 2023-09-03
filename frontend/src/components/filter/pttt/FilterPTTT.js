import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';

function FilterPTTT({ setCondition }) {
  const [filter, setFilter] = useState({
   pttt:'',
  });

  useEffect(() => {
    const condition = {
      $and: [
        {
          $or: [
            {
              ma_pttt: {
                $regex: filter.pttt.split(' ').join('.*'),
                $options: 'i',
              },
            },
            {
              ten_pttt: {
                $regex: filter.pttt.split(' ').join('.*'),
                $options: 'i',
              },
            },
            { $text: { $search: filter.pttt } },
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
        title="Mã, tên phương thức"
        onSearch={(value) => setFilter({ ...filter, pttt: value })}
      />
    </Stack>
  );
}

export default FilterPTTT;
