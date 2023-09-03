import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';

function FilterKho({ setCondition }) {
  const [filter, setFilter] = useState({
    kho: '',
  });

  useEffect(() => {
    const condition = {
      $or: [
        { ma_kho: { $regex: filter.kho.split(' ').join('.*'), $options: 'i' } },
        {
          ten_kho: { $regex: filter.kho.split(' ').join('.*'), $options: 'i' },
        },
        { $text: { $search: filter.kho } },
      ],
    };
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã, tên kho"
        onSearch={(value) => setFilter({ kho: value })}
      />
    </Stack>
  );
}

export default FilterKho;
