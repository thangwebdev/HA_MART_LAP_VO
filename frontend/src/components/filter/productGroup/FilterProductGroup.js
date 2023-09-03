import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';

function FilterProductGroup({ setCondition }) {
  const [filter, setFilter] = useState({ nhom_vat_tu: '' });

  useEffect(() => {
    const condition = {
      $or: [
        {
          ma_nvt: {
            $regex: filter.nhom_vat_tu.split(' ').join('.*'),
            $options: 'i',
          },
        },
        {
          ten_nvt: {
            $regex: filter.nhom_vat_tu.split(' ').join('.*'),
            $options: 'i',
          },
        },
        { $text: { $search: filter.nhom_vat_tu } },
      ],
    };
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã, tên nhóm vật tư"
        onSearch={(value) => setFilter({ nhom_vat_tu: value })}
      />
    </Stack>
  );
}

export default FilterProductGroup;
