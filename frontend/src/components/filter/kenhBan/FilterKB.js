import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';

function FilterKB({ setCondition }) {
  const [filter, setFilter] = useState({
    kenh: '',
  });
  useEffect(() => {
    const condition = {
      $and: [
        {
          $or: [
            {
              ma_kenh: {
                $regex: filter.kenh.split(' ').join('.*'),
                $options: 'i',
              },
            },
            {
              ten_kenh: {
                $regex: filter.kenh.split(' ').join('.*'),
                $options: 'i',
              },
            },
            { $text: { $search: filter.kenh } },
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
        title="Mã, tên kênh bán"
        onSearch={(value) => setFilter({ ...filter, kenh: value })}
      />

     
    </Stack>
  );
}

export default FilterKB;
