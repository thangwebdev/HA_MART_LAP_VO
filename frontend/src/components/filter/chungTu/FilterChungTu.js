import React, { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import FilterSearch from '../FilterSearch';

function FilterChungTu({ setCondition }) {
  const [filter, setFilter] = useState({
    chung_tu: '',
  });

  useEffect(() => {
    const condition = {
      $or: [
        {
          ma_ct: {
            $regex: filter.chung_tu.split(' ').join('.*'),
            $options: 'i',
          },
        },
        {
          ten_ct: {
            $regex: filter.chung_tu.split(' ').join('.*'),
            $options: 'i',
          },
        },
      ],
    };
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã, tên chứng từ"
        onSearch={(value) => setFilter({ chung_tu: value })}
      />
    </Stack>
  );
}

export default FilterChungTu;
