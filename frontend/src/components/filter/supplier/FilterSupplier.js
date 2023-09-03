import React, {useState, useEffect} from 'react'
import { Stack } from '@mui/material';
import FilterSearch from '../FilterSearch';

function FilterSupplier({ setCondition }) {
  const [filter, setFilter] = useState({ nha_cung_cap: '' });

  useEffect(() => {
    const condition = {
      $or: [
        {
          ma_ncc: {
            $regex: filter.nha_cung_cap.split(' ').join('.*'),
            $options: 'i',
          },
        },
        {
          ten_ncc: {
            $regex: filter.nha_cung_cap.split(' ').join('.*'),
            $options: 'i',
          },
        },
        { $text: { $search: filter.nha_cung_cap } },
      ],
    };
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã, tên nhà cung cấp"
        onSearch={(value) => setFilter({ nha_cung_cap: value })}
      />
    </Stack>
  );
}

export default FilterSupplier;
