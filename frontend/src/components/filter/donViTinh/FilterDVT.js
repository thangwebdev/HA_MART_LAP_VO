import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';

function FilterDVT({ setCondition }) {
  const [filter, setFilter] = useState({
    don_vi_tinh: '',
  });

  useEffect(() => {
    const condition = {
      $or: [
        { ma_dvt: { $regex: filter.don_vi_tinh, $options: 'i' } },
        { ten_dvt: { $regex: filter.don_vi_tinh, $options: 'i' } },
      ],
    };
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã, tên đơn vị tính"
        onSearch={(value) => setFilter({ don_vi_tinh: value })}
      />
    </Stack>
  );
}

export default FilterDVT;
